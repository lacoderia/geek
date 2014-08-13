class Users::RegistrationsController < Devise::RegistrationsController
  before_filter :update_sanitized_params, if: :devise_controller?

  def update_sanitized_params
    devise_parameter_sanitizer.for(:sign_up) {|u| u.permit(:first_name, :last_name, :email, :password, :password_confirmation, :uid, :token, :role_ids)}
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
					Student.create(credits: 0.0, user: @user)
					sign_in @user
					format.html { redirect_to home_student_url }
        	format.json { render :show, status: :created, location: @user }
				else
					#crear calendario
					Tutor.create(user: @user)
					sign_in @user
					format.html { redirect_to home_tutor_url }
        	format.json { render :show, status: :created, location: @user }
				end
      else
        format.html { render :new }
        format.json { render json: @user.errors, status: :unprocessable_entity }
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
      params.require(:user).permit(:uid, :first_name, :last_name, :token, :email, :role_ids, :password, :password_confirmation)
    end


end
