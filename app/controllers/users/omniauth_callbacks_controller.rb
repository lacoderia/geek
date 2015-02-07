class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController

  def facebook
    @user = User.find_by_email(auth_hash.info.email)
    if @user
      #flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "Facebook"
      sign_in @user
      if @user.role? :student
        session["devise.facebook_data"] = nil
        redirect_to '/student#/dashboard'
      else #este no deberia de pasar
        session["devise.google_data"] = nil
        redirect_to :tutor_redirect
      end
    else
      session["devise.facebook_data"] = auth_hash.except("extra")
      redirect_to student_landing_url
    end
  end

  def google_oauth2
    @user = User.find_by_email(auth_hash.info.email)
    #session["devise.refresh_token"] = nil
    if @user
      if session["devise.refresh_token"]
        session["devise.refresh_token"] = nil
        @user.update_attribute(:refresh_token, auth_hash["credentials"]["refresh_token"])
        sign_in @user
        redirect_to :tutor_redirect
      elsif (@user.refresh_token and @user.refresh_token.length == 0) or (@user.refresh_token == nil)
        #reprompt
        session["devise.refresh_token"] = true
        redirect_to user_omniauth_authorize_path(:google_oauth2, { prompt: 'consent' })
      else
        flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "Google"
        sign_in @user
        if @user.role? :student #este no deberia de pasar
          session["devise.facebook_data"] = nil
          redirect_to '/student#/dashboard'
        else
          session["devise.google_data"] = nil
          redirect_to :tutor_redirect
        end
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
