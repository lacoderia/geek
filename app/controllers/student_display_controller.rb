class StudentDisplayController < ApplicationController

  def landing
    if session["devise.facebook_data"]
      auth_hash = session["devise.facebook_data"]
      role = Role.find_by_name("student")
      @user = User.new(:first_name => auth_hash["info"]["first_name"], :last_name => auth_hash["info"]["last_name"], :uid => auth_hash["uid"], :email => auth_hash["info"]["email"], :token => auth_hash["credentials"]["token"], :refresh_token => auth_hash["credentials"]["refresh_token"], :roles => [role])
    elsif session["student.login"]
      @login = true
    end
  end

  def dashboard
    #session["devise.facebook_data"] = nil
  end

  def show
    @categories = Category.all
    render params[:id], layout: 'display'
  end

  def profile
    id = params[:tutor_id]
    if current_user
      redirect_to "/student#/dashboard/#{id}/tutor-profile"
    else
      redirect_to "/#/home/#{id}/tutor-profile"
    end
  end

end
