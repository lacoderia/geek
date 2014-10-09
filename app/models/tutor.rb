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
		token = self.token
		calendar = self.calendar_id
		client = Google::APIClient.new
		client.authorization.access_token = token
		service = client.discovered_api('calendar', 'v3')
		attendees_emails = [{'email' => student.email}]

		result = client.execute(:api_method => service.events.insert, :parameters => {'calendarId' => calendar, 'sendNotifications' => true}, :body => JSON.dump('start' => {'dateTime' => start_date.to_json.gsub(/"/, '') }, 'end' => {'dateTime' => (start_date + length_in_hours.hour).to_json.gsub(/"/, '') }, 'summary' => name, 'attendees' => attendees_emails ), :headers => {'Content-Type' => 'application/json'})
		
		# appointment_status_id 1 == enviado
		Appointment.create(student_id: student.id, tutor_id: self.id, appointment_id: JSON.parse(result.response.body)["id"], date: start_date, appointment_status_id: 1)
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

	def self.get_availabilities tutor_id, month, year
		result = {}
		tutor = Tutor.find(tutor_id)

		#llenar numero de días por mes, con todos los horarios disponibles
		number_of_days = Time.days_in_month(params[:month], params[:year])
		(1..number_of_days).each do |i|
			result[i] = (0..23).to_a
		end
		
		# primero, checar contra vacaciones. NO es parte del MVP
		# segundo, revisar contra clases en request y en agendadas
		appointments = tutor.appointments.where("EXTRACT(month from start) = ? ", params[:month])
		appointments.each do |appointment|
			dif = appointment.end.hour - appointment.start.hour 
			result[appointment.start.day] -= (appointment.start.hour..(appointment.start.hour+dif-1)).to_a
		end
			
		# tercero, agendar contra disponibilidades por semana especifica					
		# cuarto, revisar contra preferencias generales
	end 

end
