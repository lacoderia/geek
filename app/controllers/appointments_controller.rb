class AppointmentsController < ApplicationController
  before_action :set_appointment, only: [:show, :edit, :update, :destroy]

  # GET /appointments
  # GET /appointments.json
  def index
    @appointments = Appointment.all
  end

  # GET /appointments/1
  # GET /appointments/1.json
  def show
  end

  # GET /appointments/new
  def new
    @appointment = Appointment.new
  end

  # GET /appointments/1/edit
  def edit
  end

  # POST /appointments
  # POST /appointments.json
  def create
    @appointment = Appointment.new(appointment_params)

    respond_to do |format|
      if @appointment.save
        format.html { redirect_to @appointment, notice: 'Appointment was successfully created.' }
        format.json { render :show, status: :created, location: @appointment }
      else
        format.html { render :new }
        format.json { render json: @appointment.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /appointments/1
  # PATCH/PUT /appointments/1.json
  def update
    respond_to do |format|
      if @appointment.update(appointment_params)
        if @appointment.appointment_status_id == 4 or @appointment.appointment_status_id == 2 #Estatus cancelado o rechazado
          @appointment.tutor.delete_appointment @appointment 
        end
        UserMailer.tutor_notification_email(@appointment.tutor_id, @appointment.appointment_status_id, @appointment.subject).deliver
        UserMailer.student_notification_email(appointment.student_id, appointment.appointment_status_id, @appointment.subject).deliver

        format.html { redirect_to @appointment, notice: 'Appointment was successfully updated.' }
        format.json { render :show, status: :ok, location: @appointment }
      else
        format.html { render :edit }
        format.json { render json: @appointment.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /appointments/1
  # DELETE /appointments/1.json
  def destroy
    @appointment.destroy
    respond_to do |format|
      format.html { redirect_to appointments_url, notice: 'Appointment was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  # Recibe:
  # appointment_status_id = ID del estado de la cita
  # Regresa:
  # lista de appointments
  def by_status_and_tutor
    @appointments = []
    if current_user
      @appointments = Tutor.list_appointments_by_status(current_user.id, params[:appointment_status_id])
    end
  end

  # Recibe:
  # month = numero de mes (opcional)
  # year = numero de año (opcional)
  # previous = true si se quieren las citas historicas (opcional)
  # Regresa:
  # lista de appointments. Todos si no se pasaron parámetros. Solo las anteriores a hoy si tiene parametro previous
  def by_tutor 
    @appointments = []
    if current_user and current_user.client_type == "Tutor"
      if @grouped = params[:previous]
        @appointments = Tutor.list_previous_appointments(current_user.client_id) 
      else
        @appointments = Tutor.list_appointments(current_user.client_id, params[:month], params[:year])
      end
    end
  end

  # Recibe:
  # month = numero de mes (opcional)
  # year = numero de año (opcional)
  # previous = true si se quieren las citas historicas (opcional)
  # Regresa:
  # lista de appointments. Todos si no se pasaron parámetros. Solo las anteriores a hoy si tiene parametro previous
  def by_student
    @appointments = []
    if current_user and current_user.client_type == "Student"
      if @grouped = params[:previous]
        @appointments = Student.list_previous_appointments(current_user.client_id) 
      else
        @appointments = Student.list_appointments(current_user.client_id, params[:month], params[:year])
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_appointment
      @appointment = Appointment.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def appointment_params
      params.require(:appointment).permit(:appointment_status_id, :student_id, :tutor_id, :start, :end, :details, :address_id)
    end
end
