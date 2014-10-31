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

  after_create :set_default_preferences

  def set_default_preferences
    self.update_attribute(:preference, Preference.create(cost: 0.00, online: false, office: true))
  end

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
      appointment = Appointment.create(student_id: student.id, tutor_id: self.id, appointment_id: JSON.parse(result.response.body)["id"], start: start_date, end: start_date + length_in_hours.hour, appointment_status_id: 1, subject: name)
      UserMailer.tutor_notification_email(appointment.tutor_id, appointment.appointment_status_id, name).deliver
      UserMailer.student_notification_email(appointment.student_id, appointment.appointment_status_id, name).deliver

      return appointment 
    rescue Exception => e
      logger.error ("ERROR #{e}")
      return nil 
    end
  end

  def delete_appointment appointment
	
    # appointment_status_id 3 = confirmado, 4 = cancelado
    #if appointment.appointment_status_id == 3
      client = Google::APIClient.new
      token = self.token
      client.authorization.access_token = token
      service = client.discovered_api('calendar', 'v3')
      calendar = self.calendar_id
      event = appointment.appointment_id
      client.execute(:api_method => service.events.delete, :parameters => {'calendarId' => calendar, 'eventId' => event, 'sendNotifications' => true}, :headers => {'Content-Type' => 'application/json'})
      # appointment.update_attribute(:appointment_status_id, 4)
    #else
    #  raise "El evento no está confirmado"
    #end

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
      dif_hour = availability.end.hour - availability.start.hour
      start_min = availability.start.min > 0 ? 0.5 : 0.0
      end_min = availability.end.min > 0 ? 0.5 : 0.0
      day_in_month = first_monday + (availability.week_day_id - 1)
      day_in_month -= 7 if day_in_month > 7
      while day_in_month <= number_of_days do
        if not result[day_in_month]
          result[day_in_month] = []
        end
        difference = (availability.start.hour + start_min)..(availability.start.hour+dif_hour -0.5 + end_min)
        result[day_in_month] += (difference).step(0.5).to_a
        day_in_month += 7
      end
    end

    # tercero, agregar disponibilidades por semana especifica					
    specific_availabilities = tutor.specific_availabilities.where("EXTRACT(month from start) = ? AND EXTRACT(year from start) = ?", month, year)
    specific_availabilities.each do |sa|
      dif_hour = sa.end.hour - sa.start.hour
      start_min = sa.start.min > 0 ? 0.5 : 0.0
      end_min = sa.end.min > 0 ? 0.5 : 0.0
      difference = (sa.start.hour + start_min)..(sa.start.hour+dif_hour -0.5 + end_min)
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
      start_min = appointment.start.min > 0 ? 0.5 : 0.0
      end_min = appointment.end.min > 0 ? 0.5 : 0.0
      difference = (appointment.start.hour + start_min)..(appointment.start.hour+dif_hour -0.5 + end_min)
      if result[appointment.start.day]
        result[appointment.start.day] -= (difference).step(0.5).to_a
        result.delete(appointment.start.day) if result[appointment.start.day].empty?
      end
      
    end

    formatted_result = []

    result.each do |key, value|

      obj = {:day => key}
      initial_hour = value[0]
      end_hour = nil
      previous_hour = nil
      value.each do |hour|
        if hour == initial_hour
          end_hour = initial_hour
        elsif hour == previous_hour + 0.5 
          end_hour = hour
          obj[:start] = initial_hour
          obj[:end] = end_hour + 0.5 
        else
          obj[:start] = initial_hour
          obj[:end] = end_hour + 0.5
          formatted_result << Tutor.transfrom_hours(obj)
          obj = {:day => key}
          initial_hour = hour
          end_hour = initial_hour 
          obj[:start] = initial_hour
          obj[:end] = end_hour + 0.5
        end
        previous_hour = hour
      end

      formatted_result << Tutor.transfrom_hours(obj)

    end

    formatted_result.sort_by { |hash| [hash[:day], hash[:start]]}
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

  # month, year, previous pueden ser nil. 
  def self.list_appointments tutor_id, month, year 
    tutor = Tutor.find tutor_id
    if month and year
      tutor.appointments.includes(:student, :address, :appointment_status).where("EXTRACT(month from start) = ? AND EXTRACT(year from start) = ?", month.to_i, year.to_i).order(:appointment_status_id)
    else
      tutor.appointments.includes(:student, :address, :appointment_status).order(:appointment_status_id)
    end
  end

  def self.list_previous_appointments(tutor_id)
    tutor = Tutor.find tutor_id
    appointments = tutor.appointments.select("*, EXTRACT(year from appointments.end) as per_year, EXTRACT(month from appointments.end) as per_month, EXTRACT(day from appointments.end) as per_day").includes(:student, :address, :appointment_status).where("appointments.end < ?", Time.now ).order("start DESC")
    result = {}
    appointments.each do |appointment|
      key = "#{appointment.per_year.to_i}-#{'%02d' % appointment.per_month.to_i}-#{'%02d' % appointment.per_day.to_i}"
      result[key] = [] if not result[key]
      result[key] << appointment
    end
    result.sort.to_h
  end

  def self.save_availabilities tutor_id, availabilities

    tutor = Tutor.joins(:preference).find tutor_id
    preference = tutor.preference
    preference.availabilities.destroy_all

    if availabilities

      availabilities.each do |availability|
        day = WeekDay.find_by_day_number(availability["day_number"])
        start_time = Time.zone.parse("0001-01-01T#{availability['start']}")
        end_time = Time.zone.parse("0001-01-01T#{availability['end']}") 
        preference.availabilities << Availability.create(week_day_id: day.id, preference_id: preference.id, start: start_time, end: end_time)
      end

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

  def create_dummy_appointments month, year
    students = Student.where("token is not null")
    students.each do |student|
      prng = Random.new
      cat = Category.all[prng.rand(0..Category.count-1)]
      time = Time.now
      days_in_month = Time.days_in_month(month, year)
      start = Time.zone.parse("#{year}-#{month}-#{'%02d' % prng.rand(1..days_in_month)} #{'%02d' % prng.rand(0..23)}:00")
      appointment = self.create_appointment cat.name, start, 1, student
      appointment.update_attribute(:appointment_status_id, prng.rand(1..AppointmentStatus.count))
    end
  end

  def create_dummy_selected_appointments start_hour, day, month, year
    student = Student.where("token is not null").last
    if student
      cat = self.categories.last
      start = Time.zone.parse("#{year}-#{month}-#{'%02d' % day} #{'%02d' % start_hour}:00")
      appointment = self.create_appointment cat.name, start, 1, student
    end
  end

  def self.transfrom_hours obj
    start_hour = '%02d' % obj[:start]
    end_hour = '%02d' % obj[:end]

    start_min = obj[:start].modulo(1)
    end_min = obj[:end].modulo(1)

    if start_min > 0
      obj[:start] = "#{start_hour}:30"
    else
      obj[:start] = "#{start_hour}:00"
    end

    if end_min > 0
      obj[:end] = "#{end_hour}:30"
    else
      obj[:end] = "#{end_hour}:00"
    end
    obj
  end

end
