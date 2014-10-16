class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController

  def facebook
    @user = User.find_by_email(auth_hash.info.email)
    if @user
      #flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "Facebook"
      sign_in @user
      #@user.update_attribute(:token, auth_hash.credentials.token)
      if @user.role? :student
        session["devise.facebook_data"] = nil
        redirect_to student_dashboard_url
      else #este no deberia de pasar
        session["devise.google_data"] = nil
        redirect_to tutor_dashboard_url
      end
    else
      session["devise.facebook_data"] = auth_hash.except("extra")
      redirect_to student_landing_url
    end
  end

  def google_oauth2
    @user = User.find_by_email(auth_hash.info.email)
    #logger.info("AUTH HASH #{auth_hash.to_yaml}")
    if @user
      flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "Google"
      sign_in @user
      if @user.role? :student #este no deberia de pasar
        session["devise.facebook_data"] = nil
	redirect_to student_dashboard_url
      else
        session["devise.google_data"] = nil
	redirect_to tutor_dashboard_url
      end
    else
      session["devise.google_data"] = auth_hash.except("extra")
      redirect_to tutor_landing_url
      #redirect_to tutor_registration_url
    end
  end

  def auth_hash
    request.env["omniauth.auth"]
  end

  def failure
    redirect_to student_landing_url
  end
end
