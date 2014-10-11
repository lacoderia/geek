class Tutor < ActiveRecord::Base

	require 'google/api_client'
	require 'google/api_client/client_secrets'
	require 'google/api_client/auth/file_storage'
  
  acts_as :user, :as => :client
	belongs_to :preference	
	belongs_to :bank_account
	has_many :vacations
	has_many :reviews
	has_and_belongs_to_many :counties
	has_and_belongs_to_many :categories
	has_many :appointments
	has_many :specific_availabilities
	has_many :availabilities, through: :preference

	def refresh_token_action
		client = Google::APIClient.new
	  client.authorization.client_id = ENV['GOOGLE_CLIENT_ID']
  	client.authorization.client_secret = ENV['GOOGLE_CLIENT_SECRET']
	  client.authorization.grant_type = 'refresh_token'
  	client.authorization.refresh_token = self.refresh_token 

	  response = client.authorization.fetch_access_token!
  	client.authorization
		self.update_attribute(:token, response["access_token"])
	end

	def create_appointment name, start_date, length_in_hours, student 
		begin
			token = self.token
			calendar = self.calendar_id
			client = Google::APIClient.new
			client.authorization.access_token = token
			service = client.discovered_api('calendar', 'v3')
			attendees_emails = []
			# Revisar si se quiere mandar confirmación a los attendees por correo
			# attendees_emails = [{'email' => self.email}, {'email' => student.email}]
			result = client.execute(:api_method => service.events.insert, :parameters => {'calendarId' => calendar, 'sendNotifications' => true}, :body => JSON.dump('start' => {'dateTime' => start_date.to_json.gsub(/"/, '') }, 'end' => {'dateTime' => (start_date + length_in_hours.hour).to_json.gsub(/"/, '') }, 'summary' => name, 'attendees' => attendees_emails ), :headers => {'Content-Type' => 'application/json'})
			# appointment_status_id 1 == enviado
			Appointment.create(student_id: student.id, tutor_id: self.id, appointment_id: JSON.parse(result.response.body)["id"], start: start_date, end: start_date + length_in_hours.hour, appointment_status_id: 1)
			return true
		rescue Exception => e
			logger.error ("ERROR #{e}")
			return false
		end
	end

	def delete_appointment appointment
	
		if appointment.appointment_status_id != 3
			client = Google::APIClient.new
			token = self.token
			client.authorization.access_token = token
			service = client.discovered_api('calendar', 'v3')
			calendar = self.calendar_id
			event = appointment.appointment_id
			client.execute(:api_method => service.events.delete, :parameters => {'calendarId' => calendar, 'eventId' => event, 'sendNotifications' => true}, :headers => {'Content-Type' => 'application/json'})
			# appointment_status_id 3 == cancelado
			appointment.update_attribute(:appointment_status_id, 3)
		else
			raise "El evento ya ha sido cancelado"
		end

	end

	def self.availability_list tutor_id, month, year
		result = {}
		tutor = Tutor.find(tutor_id)

		number_of_days = Time.days_in_month(month, year)

		ix = 1
		while ix <= 7 do
			first_monday = Date.new(year, month, ix).wday
			if first_monday == 1
				break
			end
			ix += 1
		end
		first_monday = ix

		# primero, checar contra vacaciones. NO es parte del MVP
					
		# segundo, revisar contra preferencias generales
		availabilities = tutor.availabilities
		availabilities.each do |availability|
			#week_day = a.id > 6 ? 0 : a.id
			dif = availability.end.hour - availability.start.hour
			day_in_month = first_monday + (availability.week_day_id - 1)
			day_in_month -= 7 if day_in_month > 7
			while day_in_month <= number_of_days do
				result[day_in_month] = []
				result[day_in_month] += (availability.start.hour..(availability.start.hour+dif-1)).to_a
				day_in_month += 7
			end
		end

		# tercero, agregar disponibilidades por semana especifica					
		specific_availabilities = tutor.specific_availabilities.where("EXTRACT(month from start) = ?", month)

		specific_availabilities.each do |sa|
			dif = sa.end.hour - sa.start.hour
			if not result[sa.start.day]
				result[sa.start.day] = [] 
			else 
				result[sa.start.day] -= (sa.start.hour..(sa.start.hour+dif-1)).to_a
			end
			result[sa.start.day] += (sa.start.hour..(sa.start.hour+dif-1)).to_a
			result[sa.start.day].sort!
		end

		# cuarto, quitar contra clases en request y en agendadas
		appointments = tutor.appointments.where("EXTRACT(month from start) = ? ", month)
		appointments.each do |appointment|
			dif = appointment.end.hour - appointment.start.hour 
			result[appointment.start.day] -= (appointment.start.hour..(appointment.start.hour+dif-1)).to_a if result[appointment.start.day]
		end

		result
	end 

	def self.request_class tutor_id, start, length, student_id, description
		tutor = Tutor.find(tutor_id)
		start_date = DateTime.iso8601(start)	
		student = Student.find(student_id)
		# TODO: Validar que tenga disponibilidad		
		tutor.refresh_token_action
		tutor.create_appointment description, start_date, length, student 
	end

end
