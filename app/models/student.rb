class Student < ActiveRecord::Base
  
  acts_as :user, :as => :client
  has_many :reviews
  has_and_belongs_to_many :purchases
  has_many :appointments

  # month, year, previous pueden ser nil. Previous es la primera condicion que se checa para retornar el historico
  def self.list_appointments student_id, month, year, previous
    student = Student.find student_id
    if previous
      student.appointments.includes(:tutor, :address, :appointment_status).where("appointments.end < ?", Time.now ).order(:appointment_status_id)
    elsif month and year
      student.appointments.includes(:tutor, :address, :appointment_status).where("EXTRACT(month from start) = ? AND EXTRACT(year from start) = ?", month.to_i, year.to_i).order(:appointment_status_id)
    else
      student.appointments.includes(:tutor, :address, :appointment_status).order(:appointment_status_id)
    end
  end

end
