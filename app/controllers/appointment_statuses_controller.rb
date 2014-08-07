class AppointmentStatusesController < ApplicationController
  before_action :set_appointment_status, only: [:show, :edit, :update, :destroy]

  # GET /appointment_statuses
  # GET /appointment_statuses.json
  def index
    @appointment_statuses = AppointmentStatus.all
  end

  # GET /appointment_statuses/1
  # GET /appointment_statuses/1.json
  def show
  end

  # GET /appointment_statuses/new
  def new
    @appointment_status = AppointmentStatus.new
  end

  # GET /appointment_statuses/1/edit
  def edit
  end

  # POST /appointment_statuses
  # POST /appointment_statuses.json
  def create
    @appointment_status = AppointmentStatus.new(appointment_status_params)

    respond_to do |format|
      if @appointment_status.save
        format.html { redirect_to @appointment_status, notice: 'Appointment status was successfully created.' }
        format.json { render :show, status: :created, location: @appointment_status }
      else
        format.html { render :new }
        format.json { render json: @appointment_status.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /appointment_statuses/1
  # PATCH/PUT /appointment_statuses/1.json
  def update
    respond_to do |format|
      if @appointment_status.update(appointment_status_params)
        format.html { redirect_to @appointment_status, notice: 'Appointment status was successfully updated.' }
        format.json { render :show, status: :ok, location: @appointment_status }
      else
        format.html { render :edit }
        format.json { render json: @appointment_status.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /appointment_statuses/1
  # DELETE /appointment_statuses/1.json
  def destroy
    @appointment_status.destroy
    respond_to do |format|
      format.html { redirect_to appointment_statuses_url, notice: 'Appointment status was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_appointment_status
      @appointment_status = AppointmentStatus.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def appointment_status_params
      params.require(:appointment_status).permit(:name)
    end
end
