class Users::RegistrationsController < Devise::RegistrationsController
	
  #APIs para el calendario
  require 'google/api_client'
  require 'google/api_client/client_secrets'
  require 'google/api_client/auth/file_storage'

  before_filter :update_sanitized_params, if: :devise_controller?
  skip_before_filter :require_no_authentication, :only => [ :new, :create, :cancel ]  

  def update_sanitized_params
    devise_parameter_sanitizer.for(:sign_up) {|u| u.permit(:first_name, :last_name, :email, :password, :password_confirmation, :uid, :token, :refresh_token, :role_ids)}
    devise_parameter_sanitizer.for(:account_update) {|u| u.permit(:first_name, :last_name, :email, :password, :password_confirmation, :current_password)}
  end

  def create
    @user = User.new(user_params)

    params[:user][:role_ids].each do |id|
      @user.roles << Role.find(id)
    end

    respond_to do |format|
      if @user.save
        if @user.role? :student
          if @user.uid and @user.uid != "" 
            #Subir foto de facebook a cloudinary
            image = Cloudinary::Uploader.upload("https://graph.facebook.com/"+@user.uid+"/picture?width=400&height=400", :width => 375, :height => 800, :crop => :limit)
            Student.create(credits: 0.0, user: @user, picture_id: image["public_id"], picture_url: image["url"] )
          else
            Student.create(credits: 0.0, user: @user)
          end
          sign_in @user
          format.html { redirect_to '/student#/dashboard' }
          format.json { render :show, status: :created, location: @user }
        else
          #crear calendario
          client = Google::APIClient.new
          client.authorization.access_token = @user.token
          service = client.discovered_api('calendar', 'v3')
          result = client.execute(:api_method => service.calendars.insert, :parameters => {}, :body => JSON.dump('summary' => 'Geek'), :headers => {'Content-Type' => 'application/json'})
          calendar_id = JSON.parse(result.response.env.body)["id"]

          Tutor.create(user: @user, calendar_id: calendar_id)
          sign_in @user
          format.html { redirect_to :tutor_redirect }
          format.json { render :show, status: :created, location: @user }
        end
      else
        if @user.role? :student
          format.html { redirect_to student_landing_url }
          format.json { render json: @user.errors, status: :unprocessable_entity }
        else
          format.html { redirect_to tutor_landing_url }
          format.json { render json: @user.errors, status: :unprocessable_entity }
        end
      end
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_user
    @user = User.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def user_params
    params.require(:user).permit(:uid, :first_name, :last_name, :token, :refresh_token, :email, :role_ids, :password, :password_confirmation)
  end

end
