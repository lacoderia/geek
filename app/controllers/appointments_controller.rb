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
  # next = true si se quieren las citas futuras (opcional)
  # Regresa:
  # lista de appointments. Todos si no se pasaron parámetros. Solo las anteriores a hoy si tiene parametro previous
  def by_tutor 
    @appointments = []
    if current_user and current_user.client_type == "Tutor"
      if params[:previous]
        @grouped = true
        @appointments = Tutor.list_grouped_appointments(current_user.client_id, true) 
      elsif params[:next]
        @grouped = true
        @appointments = Tutor.list_grouped_appointments(current_user.client_id, false) 
      else
        @appointments = Tutor.list_appointments_by_month_and_year(current_user.client_id, params[:month], params[:year])
      end
    end
  end

  # Recibe:
  # month = numero de mes (opcional)
  # year = numero de año (opcional)
  # previous = true si se quieren las citas historicas (opcional)
  # next = true si se quieren las citas futuras (opcional)  
  # Regresa:
  # lista de appointments. Todos si no se pasaron parámetros. Solo las anteriores a hoy si tiene parametro previous
  def by_student
    @appointments = []
    if current_user and current_user.client_type == "Student"
      if params[:previous]
        @grouped = true
        @appointments = Student.list_grouped_appointments(current_user.client_id, true) 
      elsif params[:next]
        @grouped = true
        @appointments = Student.list_grouped_appointments(current_user.client_id, false) 
      else
        @appointments = Student.list_appointments_by_month_and_year(current_user.client_id, params[:month], params[:year])
      end
    end
  end

  # Actualiza el estatus de una cita
  # Recibe:
  # code = el código de estatus
  # Regresa:
  # la cita actualizada
  def change_status
    @appointment = Appointment.find(params[:id])
    status = AppointmentStatus.find_by_code(params[:code])
    @appointment.appointment_status_id = status.id
    if @appointment.save
      @appointment.update_cancelled_rejected_appointment status 
      render :show, status: :ok, location: @appointment
    else
      render json: @appointment.errors, status: :unprocessable_entity
    end
  end

  # Forza el cargo a un estudiante
  # Recibe:
  # id = el ID del appointment
  # Regresa:
  # success - true si se logró cobrar, success - false con error - description
  def force_charge
    @appointment = Appointment.find(params[:id])
    @appointment.force_charge
  end

  # Forza el cargo a un estudiante
  # Recibe:
  # id = el ID del appointment
  # fee_student = el porcentaje que se le va a cobrar al estudiante. Default es 100 del costo de la clase
  # fee_tutor = el porcentaje que le corresponde al tutor. Default es 80 de lo que se le cobre al estudiante
  # Regresa:
  # success - true si se logró cobrar, success - false con error - description
  def force_pay
    @appointment = Appointment.find(params[:id])
    @appointment.force_pay 
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
