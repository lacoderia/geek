class DisplayController < ApplicationController

  def index

    #Get categories catalog
    @categories = Category.all

  end

	def complete_registration
		if session["devise.facebook_data"]
			auth_hash = session["devise.facebook_data"]
			role = Role.find_by_name("student")
		else
			auth_hash = session["devise.google_data"]
			role = Role.find_by_name("tutor")
		end

		@user = User.new(:first_name => auth_hash["info"]["first_name"], :last_name => auth_hash["info"]["last_name"], :uid => auth_hash["uid"], :email => auth_hash["info"]["email"], :token => auth_hash["credentials"]["token"], :roles => [role])

	end

	def home_student
		@student = Student.find(current_user.client_id)
	end

	def home_tutor
		@tutor = Tutor.find(current_user.client_id)
	end

end
