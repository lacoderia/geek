class Tutor < ActiveRecord::Base

  require 'google/api_client'
  require 'google/api_client/client_secrets'
  require 'google/api_client/auth/file_storage'

  acts_as :user, :as => :client
  belongs_to :preference
  has_many :vacations
  has_many :reviews
  has_and_belongs_to_many :counties
  has_and_belongs_to_many :categories
  has_many :appointments
  has_many :specific_availabilities
  has_many :availabilities, through: :preference
  has_many :categories_tutors
  accepts_nested_attributes_for :reviews

  after_create :set_defaults

  FALLBACK_NUMBER = 10
  PER_PAGE = 10

  def set_defaults
    set_default_preferences
    self.get_openpay_id
  end

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

  def create_appointment name, start_date, length_in_hours, student, cost
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
      appointment = Appointment.create(student_id: student.id, tutor_id: self.id, appointment_id: JSON.parse(result.response.body)["id"], start: start_date, end: start_date + length_in_hours.hour, appointment_status_id: 1, subject: name, cost: cost)

      # Envio de correos solo en produccion
      if Rails.env.production?
        UserMailer.tutor_notification_email(appointment.tutor_id, appointment.appointment_status_id, name).deliver
        UserMailer.student_notification_email(appointment.student_id, appointment.appointment_status_id, name).deliver
      end

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
      self.refresh_token_action
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

  def self.ranged_availability_list tutor_id, start_day, start_month, start_year, end_day, end_month, end_year

    result = []

    if start_month != end_month or start_year != end_year
      # mes distinto o año distinto
      previous_month_availabilities = self.availability_list tutor_id, start_month, start_year
      days_in_previous_month = Time.days_in_month(start_month, start_year)

      next_month_availabilities = self.availability_list tutor_id, end_month, end_year

      previous_month_availabilities.each do |pma|
        (start_day.to_i..days_in_previous_month).each do |day|
          if pma[:day] == day
            pma[:month] = start_month
            pma[:year] = start_year
            result << pma
          end
        end
      end

      next_month_availabilities.each do |nma|
        (1..end_day.to_i).each do |day|
          if nma[:day] == day
            nma[:month] = end_month
            nma[:year] = end_year
            result << nma
          end
        end
      end

    else
      # mismo mes
      availabilities = self.availability_list tutor_id, start_month, start_year
      availabilities.each do |availability|
        (start_day.to_i..end_day.to_i).each do |day|
          if availability[:day] == day
            availability[:month] = start_month
            availability[:year] = start_year
            result << availability
          end
        end
      end
    end

    return result
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
        result[day_in_month].sort!
        day_in_month += 7
      end
    end

    s_result = {}
    # tercero, sobreescribir disponibilidades por mes especifico
    specific_availabilities = tutor.specific_availabilities.where("EXTRACT(month from start) = ? AND EXTRACT(year from start) = ?", month, year)
    specific_availabilities.each do |sa|
      dif_hour = sa.end.hour - sa.start.hour
      start_min = sa.start.min > 0 ? 0.5 : 0.0
      end_min = sa.end.min > 0 ? 0.5 : 0.0
      difference = (sa.start.hour + start_min)..(sa.start.hour+dif_hour -0.5 + end_min)
      if not s_result[sa.start.day]
        s_result[sa.start.day] = []
      end

      s_result[sa.start.day] += (difference).step(0.5).to_a
      s_result[sa.start.day].sort!
    end 
    
    s_result.each do |s_key, s_value|
      result.each do |key, value|
        if s_key == s_value
          result[key] = s_result[s_key]
        end
      end
    end
     
    confirmed_appointment = AppointmentStatus.find_by_code("3")
    pending_appointment = AppointmentStatus.find_by_code("0")
    # cuarto, quitar contra clases en request y agendadas
    appointments = tutor.appointments.where("EXTRACT(month from start) = ? AND EXTRACT(year from start) = ? AND appointment_status_id in (?,?)", month, year, confirmed_appointment.id, pending_appointment.id)
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
          formatted_result << Tutor.transform_hours(obj)
          obj = {:day => key}
          initial_hour = hour
          end_hour = initial_hour
          obj[:start] = initial_hour
          obj[:end] = end_hour + 0.5
        end
        previous_hour = hour
      end

      formatted_result << Tutor.transform_hours(obj) if obj[:start] and obj[:end]

    end

    formatted_result.sort_by { |hash| [hash[:day], hash[:start]]}
  end

  def self.request_class tutor_id, start, length, student_id, description, cost
    start_date = DateTime.iso8601(start).in_time_zone
    #if start_date >= (DateTime.now + Appointment.hours_before_scheduling.hour)
    if start_date > DateTime.now
      tutor = Tutor.find(tutor_id)
      student = Student.find(student_id)
      tutor.refresh_token_action
      return tutor.create_appointment description, start_date, length, student, cost
    else
      return nil
    end
  end

  def self.list_appointments_by_status tutor_id, appointment_status_id
    tutor = Tutor.find tutor_id
    # Appointment status 1 = enviado, 2 = rechazado, 3 = confirmado, 4 = cancelado, 5 = completado
    tutor.appointments.where("appointment_status_id = ?", AppointmentStatus.find(appointment_status_id))
  end

  # month, year, previous pueden ser nil.
  def self.list_appointments_by_month_and_year tutor_id, month, year
    tutor = Tutor.find tutor_id
    if month and year
      tutor.appointments.includes(:student, :address, :appointment_status, :registered_anomalies => [:anomaly, :registered_anomaly_status]).where("EXTRACT(month from start) = ? AND EXTRACT(year from start) = ?", month.to_i, year.to_i).order(:end)
    else
      tutor.appointments.includes(:student, :address, :appointment_status, :registered_anomalies => [:anomaly, :registered_anomaly_status]).order(:end)
    end
  end

  def self.list_grouped_appointments(tutor_id, previous)
    tutor = Tutor.find tutor_id
    result = {}

    if previous
      where = "appointments.start < ?"
    else
      where = "appointments.start >= ?"
    end

    appointments = tutor.appointments.select("*, EXTRACT(year from appointments.end) as per_year, EXTRACT(month from appointments.end) as per_month, EXTRACT(day from appointments.end) as per_day").includes(:student, :address, :appointment_status, :registered_anomalies => [:anomaly, :registered_anomaly_status]).where(where, Time.now ).order("start DESC")
    appointments.each do |appointment|
      key = "#{appointment.per_year.to_i}-#{'%02d' % appointment.per_month.to_i}-#{'%02d' % appointment.per_day.to_i}"
      result[key] = [] if not result[key]
      result[key] << appointment
      result[key].sort_by!{|app| app.end}
    end
    result.sort
  end

  def self.search_by_query_params zone_id, zone_str, category_id, category_str

    if zone_id and category_id
      return Tutor.includes(:counties, :preference, :reviews, :appointments, :categories_tutors => :category).where("county_id = ? and (categories.category_id = ? OR categories.id = ?)", zone_id, category_id, category_id)
    else
      return Tutor.includes(:counties, :preference, :reviews, :appointments, :categories_tutors => :category).where("county_id = ?", zone_id) if zone_id
      return Tutor.includes(:counties, :preference, :reviews, :appointments, :categories_tutors => :category).where("categories.id = ? OR categories.category_id = ?", category_id, category_id) if category_id
    end
  end

  def self.fallback_counties sublocality, locality

    county_ids = []

    if sublocality #<-- delegacion/municipio - municipality
      municipalities = Municipality.select(:id).where("lower(unaccent(name)) like '%#{I18n.transliterate(sublocality).downcase}%'")
      municipalities.each do |municipality|

        counties = County.joins(:postal_code => :municipality).where("municipalities.id = #{municipality.id}")
        counties.each do |county|
          county_ids << county.id
        end
      end
    end

    if locality #<-- ciudad - city
      cities = City.select(:id).where("lower(unaccent(name)) like '%#{I18n.transliterate(locality).downcase}%'")
      cities.each do |city|

        counties = County.joins(:postal_code => :city).where("cities.id = #{city.id}")
        counties.each do |county|
          county_ids << county.id
        end
      end

    end
    return county_ids.uniq

  end

  def self.search_by_query_params_for_google zone_obj, category_id, category_str, page, options

    tutors = nil
    message = ""
    suggested_tutors = nil
    county_ids = []
    fallback_county_ids = []
    category_ids = []
 
    if zone_obj

      if zone_obj[:neighborhood] #<-- colonia - county
        counties = County.select(:id).where("lower(unaccent(name)) like '%#{I18n.transliterate(zone_obj[:neighborhood].downcase)}%'")
        counties.each do |county|
          county_ids << county.id
        end

      elsif zone_obj[:postal_code] #<-- cp - postal_code
        counties = County.joins(:postal_code).where("postal_codes.code = '#{zone_obj[:postal_code]}'")
        counties.each do |county|
          county_ids << county.id
        end

      elsif zone_obj[:sublocality] #<-- delegacion/municipio - municipality
        municipalities = Municipality.select(:id).where("lower(unaccent(name)) like '%#{I18n.transliterate(zone_obj[:sublocality].downcase)}%'")
        municipalities.each do |municipality|

          counties = County.joins(:postal_code => :municipality).where("municipalities.id = #{municipality.id}")
          counties.each do |county|
            county_ids << county.id
          end
        end
      elsif zone_obj[:locality] #<-- ciudad - city
        cities = City.select(:id).where("lower(unaccent(name) like '%#{I18n.transliterate(zone_obj[:locality].downcase)}%'")
        cities.each do |city|

          counties = County.joins(:postal_code => :city).where("cities.id = #{city.id}")
          counties.each do |county|
            county_ids << county.id
          end
        end

      end
      #county_ids.uniq!

    end

    if category_id
      category_ids << category_id
    elsif category_str
      categories = Category.select(:id).where("upper(unaccent(name)) like '%#{I18n.transliterate(category_str).upcase}%'")
      categories.each do |category|
        category_ids << category.id
      end
    end

    #Dos parametros de busqueda
    if not county_ids.empty? and not category_ids.empty?

      has_options = Tutor.detect_filter_flags(options)

      query_str = "(active = ? AND approved = ?) AND (county_id in (#{county_ids.map(&:inspect).join(',')}) and (categories.category_id in (#{category_ids.map(&:inspect).join(',')}) OR categories.id in (#{category_ids.map(&:inspect).join(',')})))"
      if has_options
        query_str.insert(0, Tutor.build_filter_query(options))
        tutors = Tutor.joins(:categories, :counties, :preference).where(query_str, true, true).includes(:reviews => :student).order(grade: :desc)
      else
        tutors = Tutor.joins(:categories, :counties).where(query_str, true, true).includes(:reviews => :student).order(grade: :desc)
      end

      if tutors.count < FALLBACK_NUMBER #fallback a sublocality
        fallback_county_ids = Tutor.fallback_counties zone_obj[:sublocality], nil
        message += "Fallback con sublocality."
      end
      if not fallback_county_ids.empty?

        query_str = "(active = ? AND approved = ?) AND (county_id in (#{fallback_county_ids.map(&:inspect).join(',')}) and (categories.category_id in (#{category_ids.map(&:inspect).join(',')}) OR categories.id in (#{category_ids.map(&:inspect).join(',')})))"
        if has_options
          query_str.insert(0, Tutor.build_filter_query(options))
          suggested_tutors = Tutor.joins(:categories, :counties, :preference).where(query_str, true, true).includes(:reviews => :student).order(grade: :desc)
        else
          suggested_tutors = Tutor.joins(:categories, :counties).where(query_str, true, true).includes(:reviews => :student).order(grade: :desc)
        end
        suggested_tutors = suggested_tutors - tutors

        if suggested_tutors.count < FALLBACK_NUMBER #fallback a locality
          fallback_county_ids = Tutor.fallback_counties nil, zone_obj[:locality]

          query_str = "(active = ? AND approved = ?) AND (county_id in (#{fallback_county_ids.map(&:inspect).join(',')}) AND (categories.category_id in (#{category_ids.map(&:inspect).join(',')}) OR categories.id in (#{category_ids.map(&:inspect).join(',')})))"
          if has_options
            query_str.insert(0, Tutor.build_filter_query(options))
            suggested_tutors = Tutor.joins(:categories, :counties, :preference).where(query_str, true, true).includes(:reviews => :student)
          else
            suggested_tutors = Tutor.joins(:categories, :counties).where(query_str, true, true).includes(:reviews => :student)
          end

          suggested_tutors = suggested_tutors - tutors
          message += "Fallback con locality."
        end

        if suggested_tutors.empty?
          message += " Ampliar criterios de búsqueda."
        else
          message += " Pocos resultados. Revisar tutores sugeridos."
        end
      else
        message += " Búsqueda correcta."
      end

    #Solo resultados de ubicacion
    elsif not county_ids.empty?

      has_options = Tutor.detect_filter_flags(options)

      query_str = "(active = ? AND approved = ?) AND (county_id in (#{county_ids.map(&:inspect).join(',')}))" 
      
      if has_options
        query_str.insert(0, Tutor.build_filter_query(options))
        tutors = Tutor.joins(:counties, :preference).where(query_str, true, true).includes(:reviews => :student).order(grade: :desc)
      else
        tutors = Tutor.joins(:counties).where(query_str, true, true).includes(:reviews => :student).order(grade: :desc)
      end

      if tutors.count < FALLBACK_NUMBER #fallback a sublocality
        fallback_county_ids = Tutor.fallback_counties zone_obj[:sublocality], nil
      end

      if not fallback_county_ids.empty?

        query_str = "(active = ? AND approved = ?) AND (county_id in (#{fallback_county_ids.map(&:inspect).join(',')}))"
        
        if has_options
          query_str.insert(0, Tutor.build_filter_query(options))
          suggested_tutors = Tutor.joins(:counties, :preference).where(query_str, true, true).includes(:reviews => :student).order(grade: :desc)
        else
          suggested_tutors = Tutor.joins(:counties).where(query_str, true, true).includes(:reviews => :student).order(grade: :desc)
        end

        suggested_tutors = suggested_tutors - tutors

        # Fallback hasta sublocality (delegación) en caso que no se incluyan temas
        #if suggested_tutors.count < FALLBACK_NUMBER
        #  fallback_county_ids = Tutor.fallback_counties nil, zone_obj[:locality] #fallback a locality
        #  suggested_tutors = Tutor.joins(:counties).where("county_id in (#{fallback_county_ids.map(&:inspect).join(',')})")
        #  suggested_tutors = suggested_tutors - tutors
        #end
      end

      if category_id
        #Este caso no debe pasar
        message = "No se enviaron categorías."
      elsif category_str
        message = "No se encontraron categorías asociadas a ese texto."
      else
        message = "No se enviaron categorías."
      end

    #Solo resultados de categoria
    elsif not category_ids.empty?

      has_options = Tutor.detect_filter_flags(options)

      query_str = "(active = ? AND approved = ?) AND (categories.id in (#{category_ids.map(&:inspect).join(',')}) OR categories.category_id in (#{category_ids.map(&:inspect).join(',')}))" 
      
      if has_options
        query_str.insert(0, Tutor.build_filter_query(options))
        tutors = Tutor.joins(:categories, :preference).where(query_str, true, true).includes(:reviews => :student).order(grade: :desc)
      else
        tutors = Tutor.joins(:categories).where(query_str, true, true).includes(:reviews => :student).order(grade: :desc)
      end

      if zone_obj
        message = "No se encontraron zonas asociadas a ese texto."
      else
        message = "No se enviaron zonas"
      end
    else
      #Busqueda vacia
      message = "Búsqueda vacía."
    end

    if tutors
      count = tutors.count
      if count > PER_PAGE
        tutors = tutors.paginate(:page => page, :per_page => PER_PAGE)
      end
      tutors = {:items => tutors, :count => count}
    end
    if suggested_tutors
      count = suggested_tutors.count
      if count > PER_PAGE
        suggested_tutors = suggested_tutors.paginate(:page => page, :per_page => PER_PAGE)
      end
      suggested_tutors = {:items => suggested_tutors, :count => count}
    end

    return {:message => message, :tutors => tutors, :suggested_tutors => suggested_tutors}
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
  def self.save_specific_availabilities tutor_id, specific_availabilities, start_day, start_month, start_year, end_day, end_month, end_year

    tutor = Tutor.find tutor_id
    start_date = Time.zone.local(start_year, start_month, start_day)
    end_date = Time.zone.local(end_year, end_month, end_day)
    tutor.specific_availabilities.where("start BETWEEN ? AND ?").destroy_all

    specific_availabilities.each do |sa|
      start_datetime = DateTime.iso8601(sa["start"]).in_time_zone
      end_datetime = DateTime.iso8601(sa["end"]).in_time_zone
      tutor.specific_availabilities << SpecificAvailability.create(tutor_id: tutor.id, start: start_datetime, end: end_datetime)
    end

    tutor.specific_availabilities
  end

  def create_dummy_appointments month, year, cost
    students = Student.where("token is not null")
    students.each do |student|
      prng = Random.new
      cat = Category.all[prng.rand(0..Category.count-1)]
      time = Time.now
      days_in_month = Time.days_in_month(month, year)
      start = Time.zone.parse("#{year}-#{month}-#{'%02d' % prng.rand(1..days_in_month)} #{'%02d' % prng.rand(0..23)}:00")
      appointment = self.create_appointment cat.name, start, 1, student, cost
      appointment.update_attribute(:appointment_status_id, prng.rand(1..AppointmentStatus.count))
    end
  end

  def create_dummy_selected_appointments start_hour, day, month, year, cost
    student = Student.where("token is not null").last
    if student
      cat = self.categories.last
      start = Time.zone.parse("#{year}-#{month}-#{'%02d' % day} #{'%02d' % start_hour}:00")
      appointment = self.create_appointment cat.name, start, 1, student, cost
    end
  end

  def self.transform_hours obj
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

  def self.profile email
    tutor = Tutor.joins("INNER JOIN preferences ON preferences.id = tutors.preference_id").joins("LEFT OUTER JOIN availabilities ON preferences.id = availabilities.preference_id").where('email = ? ', email).first
  end

  def self.status email
    tutor = Tutor.where('email = ? ', email)[0]
  end

  def self.by_student student
    tutors = []
    completed_appointment = AppointmentStatus.find_by_code("6")
    appointments = student.appointments.select(:tutor_id).where("appointment_status_id = ? AND charged = false AND paid = false", completed_appointment.id).uniq(:tutor_id).includes(:tutor => :reviews)
    appointments.each do |appointment|
      tutors.push(appointment.tutor)
    end
    tutors
  end

  def self.update_grade tutor_id
    tutor = Tutor.find(tutor_id)
    count = 0
    avg = 0.0
    tutor.reviews.each do |review|
      count += 1
      avg += ((review.grade_knowledge + review.grade_presentation + review.grade_communication)/3)
    end
    grade = avg/count
    tutor.update_attribute(:grade, grade)
  end

  def self.get_balance tutor_openpay_id
    balance = Payment.get_balance(tutor_openpay_id)[:result]
  end

  def self.cash_out tutor_id
    tutor = Tutor.find(tutor_id)
    balance = Tutor.get_balance(tutor.openpay_id)
    if balance > 8
      card = Card.get_active(tutor.user.id)
      fee = Payment.charge_fee(tutor.openpay_id, 8)
      if fee[:success]
        pay = Payment.pay_tutor(tutor.openpay_id, card.openpay_id, (balance - 8))
      else 
        fee
      end
    else 
      {:sucess => false, :error => {:description => "Tu saldo no es suficiente para cubrir la comisión", :error_code => 4001}}
    end
  end

  private

  def self.detect_filter_flags options
    return (options and (options["online"] or options["office"] or options["student"] or options["public"]))
  end

  def self.build_filter_query options
    #options - ["online"] ["office"] ["student"] ["public"] 
    query_array = []
    if options["online"]
      query_array << "preferences.online = true"
    end
    if options["office"]
      query_array << "preferences.office = true"
    end
    if options["student"]
      query_array << "preferences.student_place = true"
    end
    if options["public"]
      query_array << "preferences.public = true"
    end

    query_string = "("
    first = true
    query_array.each do |query|
      if first
        query_string += query
        first = false
      else
        query_string += " OR #{query}"
      end
    end
    query_string += ") AND "
    return query_string
  end

end
