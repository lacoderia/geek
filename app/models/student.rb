class Student < ActiveRecord::Base
  
  acts_as :user, :as => :client
  has_many :reviews
  has_and_belongs_to_many :purchases
  has_many :appointments

  # month, year, previous pueden ser nil. 
  def self.list_appointments_by_month_and_year student_id, month, year 
    student = Student.find student_id
    if month and year
      student.appointments.includes(:tutor, :address, :appointment_status).where("EXTRACT(month from start) = ? AND EXTRACT(year from start) = ?", month.to_i, year.to_i).order(:end)
    else
      student.appointments.includes(:tutor, :address, :appointment_status).order(:end)
    end
  end

  def self.list_grouped_appointments(student_id, previous)
    student = Student.find student_id
    result = {}

    if previous
      where = "appointments.end < ?"
    else
      where = "appointments.end >= ?"
    end

    appointments = student.appointments.select("*, EXTRACT(year from appointments.end) as per_year, EXTRACT(month from appointments.end) as per_month, EXTRACT(day from appointments.end) as per_day").includes(:tutor, :address, :appointment_status).where(where, Time.now ).order("start DESC")
    appointments.each do |appointment|
      key = "#{appointment.per_year.to_i}-#{'%02d' % appointment.per_month.to_i}-#{'%02d' % appointment.per_day.to_i}"
      result[key] = [] if not result[key]
      result[key] << appointment
    end
    result.sort.to_h
  end


end
