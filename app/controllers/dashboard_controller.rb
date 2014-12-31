class DashboardController < ApplicationController

	def by_tutor
		@requests = Appointment.get_latest_by_tutor(current_user.client_id, AppointmentStatus.find_by_code("0").id)
		@appointments = Appointment.get_latest_by_tutor(current_user.client_id, AppointmentStatus.find_by_code("3").id)
		@messages = Message.get_pending_conversations("tutor_id", current_user.client_id)
	end

	def by_student
		@requests = Appointment.get_latest_by_student(current_user.client_id, AppointmentStatus.find_by_code("0").id)
		@appointments = Appointment.get_latest_by_student(current_user.client_id, AppointmentStatus.find_by_code("3").id)
		@messages = Message.get_pending_conversations("student_id", current_user.client_id)
	end

end
