class Users::SessionsController < Devise::SessionsController
 
  def after_sign_in_path_for(user)
    if user.role? :student
      return :student_landing
    else
      return :tutor_landing
    end
  end

  def create
    @user = User.find_by_email(params[:tutor][:email])
    #logger.info("ROLES #{params[:tutor][:role_ids]}")
    path = nil
    if @user
      if @user.valid_password?(params[:tutor][:password])
        sign_in @user
        if @user.role? :student
          session["student.login"] = nil
          path = student_dashboard_url
        else
          session["tutor.login"] = nil
          path = tutor_dashboard_url
        end 
      else
        #Constraseña incorrecta
        if params[:student] and params[:student][:role_ids] == ["1"]
          session["student.login"] = true
          path = student_landing_url 
        elsif params[:tutor] and params[:tutor][:role_ids] == ["2"]
          session["tutor.login"] = true
          path = tutor_landing_url 
        end 
      end
    else
      #Usuario incorrecto
      if params[:student] and params[:student][:role_ids] == ["1"]
        session["student.login"] = true
        path = student_landing_url 
      elsif params[:tutor] and params[:tutor][:role_ids] == ["2"]
        session["tutor.login"] = true
        path = tutor_landing_url 
      end     
    end
    redirect_to path 
  end

end
