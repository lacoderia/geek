class Appointment < ActiveRecord::Base
	belongs_to :appointment_status
	belongs_to :student
	belongs_to :tutor
	belongs_to :address
end