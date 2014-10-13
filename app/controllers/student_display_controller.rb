class StudentDisplayController < ApplicationController

  def landing

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

    @user = User.new(:first_name => auth_hash["info"]["first_name"], :last_name => auth_hash["info"]["last_name"], :uid => auth_hash["uid"], :email => auth_hash["info"]["email"], :token => auth_hash["credentials"]["token"], :refresh_token => auth_hash["credentials"]["refresh_token"], :roles => [role])

  end

  def show
    @categories = Category.all
    render params[:id], layout: 'display'
  end

end
