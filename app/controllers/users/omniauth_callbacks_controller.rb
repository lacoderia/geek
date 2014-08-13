class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController

	def facebook
		@user = User.find_by_email(auth_hash.info.email)
		if @user
			flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "Facebook"
			sign_in @user
			if @user.role? :student
				redirect_to home_student_url
			else
				redirect_to home_tutor_url
			end
		else
			session["devise.facebook_data"] = auth_hash.except("extra")
			redirect_to complete_registration_url
		end
	end

	def google_oauth2
		@user = User.find_by_email(auth_hash.info.email)
		if @user
			flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "Google"
			sign_in @user
			if @user.role? :student
				redirect_to home_student_url
			else
				redirect_to home_tutor_url
			end
		else
			session["devise.google_data"] = auth_hash.except("extra")
			redirect_to complete_registration_url
		end
	end

	def auth_hash
		request.env["omniauth.auth"]
	end
end
