class Users::SessionsController < Devise::SessionsController
 
	def after_sign_in_path_for(user)
		if user.role? :student
			return :student_landing
   	else
    	return :tutor_landing
  	end
  end

end
