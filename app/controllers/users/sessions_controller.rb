class Users::SessionsController < Devise::SessionsController
 
	def after_sign_in_path_for(user)
		if user.role? :student
			return :home_student
   	else
    	return :home_tutor
  	end
  end

end
