class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception
  before_filter :verify_active_user

  def verify_active_user
    if current_user and not current_user.active
      session["errors.inactive"] = true
    end
  end
end
