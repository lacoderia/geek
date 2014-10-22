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
	
    # appointment_status_id 3 = confirmado, 4 = cancelado
    if appointment.appointment_status_id == 3
      client = Google::APIClient.new
      token = self.token
      client.authorization.access_token = token
      service = client.discovered_api('calendar', 'v3')
      calendar = self.calendar_id
      event = appointment.appointment_id
      client.execute(:api_method => service.events.delete, :parameters => {'calendarId' => calendar, 'eventId' => event, 'sendNotifications' => true}, :headers => {'Content-Type' => 'application/json'})
      appointment.update_attribute(:appointment_status_id, 4)
    else
      raise "El evento no está confirmado"
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
      dif_hour = availability.end.hour - availability.start.hour
      dif_min = availability.end.min - availability.start.min
      day_in_month = first_monday + (availability.week_day_id - 1)
      day_in_month -= 7 if day_in_month > 7
      while day_in_month <= number_of_days do
        result[day_in_month] = []
        if dif_min > 0
          difference = availability.start.hour..(availability.start.hour+dif_hour-1 + 0.5)
        else
          difference = availability.start.hour..(availability.start.hour+dif_hour-1)
        end
        result[day_in_month] += (difference).step(0.5).to_a
        day_in_month += 7
      end
    end

    # tercero, agregar disponibilidades por semana especifica					
    specific_availabilities = tutor.specific_availabilities.where("EXTRACT(month from start) = ? AND EXTRACT(year from start) = ?", month, year)

    specific_availabilities.each do |sa|
      dif_hour = sa.end.hour - sa.start.hour
      dif_min = sa.end.min - sa.start.min
      if dif_min > 0
        difference = sa.start.hour..(sa.start.hour+dif_hour-1 + 0.5)
      else
        difference = sa.start.hour..(sa.start.hour+dif_hour-1)
      end

      if not result[sa.start.day]
        result[sa.start.day] = [] 
      else 
        result[sa.start.day] -= (difference).step(0.5).to_a
      end
    
      result[sa.start.day] += (difference).step(0.5).to_a
      result[sa.start.day].sort!
    end

    # cuarto, quitar contra clases en request y en agendadas
    appointments = tutor.appointments.where("EXTRACT(month from start) = ? AND EXTRACT(year from start) = ?", month, year)
    appointments.each do |appointment|
      dif_hour = appointment.end.hour - appointment.start.hour 
      dif_min = appointment.end.min - appointment.start.min
      if dif_min > 0
        difference = appointment.start.hour..(appointment.start.hour+dif_hour-1 + 0.5)
      else
        difference = appointment.start.hour..(appointment.start.hour+dif_hour-1)
      end

      result[appointment.start.day] -= (difference).step(0.5).to_a if result[appointment.start.day]
    end

    result
  end 

  def self.request_class tutor_id, start, length, student_id, description
    tutor = Tutor.find(tutor_id)
    start_date = DateTime.iso8601(start).in_time_zone
    student = Student.find(student_id)
    # TODO: Validar que tenga disponibilidad		
    tutor.refresh_token_action
    tutor.create_appointment description, start_date, length, student 
  end

  def self.list_appointments_by_status tutor_id, appointment_status_id
    tutor = Tutor.find tutor_id
    # Appointment status 1 = enviado, 2 = rechazado, 3 = confirmado, 4 = cancelado, 5 = completado
    tutor.appointments.where("appointment_status_id = ?", AppointmentStatus.find(appointment_status_id))
  end

  # month, year, previous pueden ser nil. Previous es la primera condicion que se checa para retornar el historico
  def self.list_appointments tutor_id, month, year, previous
    tutor = Tutor.find tutor_id
    if previous
      tutor.appointments.includes(:student, :address, :appointment_status).where("appointments.end < ?", Time.now ).order(:appointment_status_id)
    elsif month and year
      tutor.appointments.includes(:student, :address, :appointment_status).where("EXTRACT(month from start) = ? AND EXTRACT(year from start) = ?", month.to_i, year.to_i).order(:appointment_status_id)
    else
      tutor.appointments.includes(:student, :address, :appointment_status).order(:appointment_status_id)
    end
  end

  def self.save_availabilities tutor_id, availabilities

    tutor = Tutor.joins(:preference).find tutor_id
    preference = tutor.preference
    preference.availabilities.destroy_all

    availabilities.each do |availability|
      day = WeekDay.find_by_day(availability["day"])
      start_time = DateTime.iso8601("0001-01-01T#{availability['start']}").in_time_zone
      end_time = DateTime.iso8601("0001-01-01T#{availability['end']}").in_time_zone
      preference.availabilities << Availability.create(week_day_id: day.id, preference_id: preference.id, start: start_time, end: end_time)
    end

    preference.availabilities
  end

  # TODO: Incluir metodo para borrar disponibilidades o alterar las existentes si se interrumpen
  def self.save_specific_availabilities tutor_id, specific_availabilities
    
    tutor = Tutor.joins(:preference).find tutor_id

    specific_availabilities.each do |sa|
      start_datetime = DateTime.iso8601(sa["start"]).in_time_zone
      end_datetime = DateTime.iso8601(sa["end"]).in_time_zone
      SpecificAvailability.create(tutor_id: tutor.id, start: start_datetime, end: end_datetime)
    end

  end

end
