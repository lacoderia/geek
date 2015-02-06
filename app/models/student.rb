class Student < ActiveRecord::Base
  
  acts_as :user, :as => :client
  has_many :reviews
  has_and_belongs_to_many :purchases
  has_many :appointments

  after_create :set_defaults

  def set_defaults
    UserMailer.student_welcome(self).deliver
  end

  # month, year, previous pueden ser nil. 
  def self.list_appointments_by_month_and_year student_id, month, year 
    student = Student.find student_id
    if month and year
      student.appointments.includes(:tutor, :address, :appointment_status, :registered_anomalies => [:anomaly, :registered_anomaly_status]).where("EXTRACT(month from start) = ? AND EXTRACT(year from start) = ?", month.to_i, year.to_i).order(:end)
    else
      student.appointments.includes(:tutor, :address, :appointment_status, :registered_anomalies => [:anomaly, :registered_anomaly_status]).order(:end)
    end
  end

  def self.list_grouped_appointments(student_id, previous)
    student = Student.find student_id
    result = {}

    if previous
      where = "appointments.start < ?"
    else
      where = "appointments.start >= ?"
    end

    appointments = student.appointments.includes(:tutor, :address, :appointment_status, :registered_anomalies => [:anomaly, :registered_anomaly_status]).where(where, Time.now ).order("start DESC")
    appointments.each do |appointment|
      key = "#{appointment.end.year.to_i}-#{'%02d' % appointment.end.month.to_i}-#{'%02d' % appointment.end.day.to_i}"
      result[key] = [] if not result[key]
      result[key] << appointment
      result[key].sort_by!{|app| app.end}
    end
    result.sort
  end

end
