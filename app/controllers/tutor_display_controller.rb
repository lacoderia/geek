class TutorDisplayController < ApplicationController

  def landing
    if session["devise.google_data"]
      auth_hash = session["devise.google_data"]
      role = Role.find_by_name("tutor")
      @user = User.new(:first_name => auth_hash["info"]["first_name"], :last_name => auth_hash["info"]["last_name"], :uid => auth_hash["uid"], :email => auth_hash["info"]["email"], :token => auth_hash["credentials"]["token"], :refresh_token => auth_hash["credentials"]["refresh_token"], :roles => [role])
    elsif session["tutor.login"]
      @login = true
    end
  end

  def redirect 
    path = '/tutor'
    if current_user
      @tutor = Tutor.where('email = ? ', current_user.email)[0]
      if @tutor.approved
        path = '/tutor#/dashboard/calendar'
      else
        path = '/tutor#/dashboard/profile'
      end
    end
    redirect_to path
  end

  def index
    @tutor = Tutor.find(current_user.client_id)
  end

end
