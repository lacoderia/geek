class Student < ActiveRecord::Base
  
  acts_as :user, :as => :client
  has_many :reviews
  has_and_belongs_to_many :purchases
  has_many :appointments

  def self.list_appointments student_id
    student = Student.find student_id
    student.appointments.includes(:tutor, :address, :appointment_status).order(:appointment_status_id)
  end

end
