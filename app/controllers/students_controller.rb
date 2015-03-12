class StudentsController < ApplicationController
  load_and_authorize_resource :except => [:update, :profile, :remember_tutor]
  
  before_action :set_student, only: [:show, :edit, :update, :destroy]

  # GET /students
  # GET /students.json
  def index
    @students = Student.all
  end

  # GET /students/1
  # GET /students/1.json
  def show
  end

  # GET /students/new
  def new
    @student = Student.new
  end

  # GET /students/1/edit
  def edit
  end

  # POST /students
  # POST /students.json
  def create
    @student = Student.new(student_params)

    respond_to do |format|
      if @student.save
        format.html { redirect_to @student, notice: 'Student was successfully created.' }
        format.json { render :show, status: :created, location: @student }
      else
        format.html { render :new }
        format.json { render json: @student.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /students/1
  # PATCH/PUT /students/1.json
  def update
    respond_to do |format|
    
      if params[:picture]
        if @student.picture_id
          Cloudinary::Api.delete_resources(["#{@student.picture_id}"])
        end
        image = Cloudinary::Uploader.upload(params[:picture], :width => 375, :height => 375, :crop => :fill)
        @student.update_attributes({:picture_url => image["url"], :picture_id => image["public_id"]})
      end

      if @student.update(student_params)
        format.html { redirect_to @student, notice: 'Student was successfully updated.' }
        format.json { render :show, status: :ok, location: @student }
      else
        format.html { render :edit }
        format.json { render json: @student.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /students/1
  # DELETE /students/1.json
  def destroy
    @student.destroy
    respond_to do |format|
      format.html { redirect_to students_url, notice: 'Student was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  # Obtiene información del estudiante loggeado
  # Regresa:
  # un objeto con la información del estudiante
  def profile
    if current_user
      @student = Student.where('email = ? ', current_user.email).first
      if session[:remember]
        @remember = session[:remember]
        session[:remember] = nil
      end
    end
  end

  # Almacena el id del tutor que se consultó antes de iniciar sesión
  # Recibe:
  # tutor_id - el id del tutor
  def remember_tutor
    session[:remember] = params[:tutor_id]
    render json: "", status: :ok
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_student
      @student = Student.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def student_params
      params.permit(:first_name, :last_name, :phone_number)
    end
end
