class StudentDisplayController < ApplicationController

	def home
		@student = Student.find(current_user.client_id)
	end

end
