class SpecificAvailabilitiesController < ApplicationController
  before_action :set_specific_availability, only: [:show, :edit, :update, :destroy]

  # GET /specific_availabilities
  # GET /specific_availabilities.json
  def index
    @specific_availabilities = SpecificAvailability.all
  end

  # GET /specific_availabilities/1
  # GET /specific_availabilities/1.json
  def show
  end

  # GET /specific_availabilities/new
  def new
    @specific_availability = SpecificAvailability.new
  end

  # GET /specific_availabilities/1/edit
  def edit
  end

  # POST /specific_availabilities
  # POST /specific_availabilities.json
  def create
    @specific_availability = SpecificAvailability.new(specific_availability_params)

    respond_to do |format|
      if @specific_availability.save
        format.html { redirect_to @specific_availability, notice: 'Specific availability was successfully created.' }
        format.json { render :show, status: :created, location: @specific_availability }
      else
        format.html { render :new }
        format.json { render json: @specific_availability.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /specific_availabilities/1
  # PATCH/PUT /specific_availabilities/1.json
  def update
    respond_to do |format|
      if @specific_availability.update(specific_availability_params)
        format.html { redirect_to @specific_availability, notice: 'Specific availability was successfully updated.' }
        format.json { render :show, status: :ok, location: @specific_availability }
      else
        format.html { render :edit }
        format.json { render json: @specific_availability.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /specific_availabilities/1
  # DELETE /specific_availabilities/1.json
  def destroy
    @specific_availability.destroy
    respond_to do |format|
      format.html { redirect_to specific_availabilities_url, notice: 'Specific availability was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_specific_availability
      @specific_availability = SpecificAvailability.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def specific_availability_params
      params.require(:specific_availability).permit(:tutor_id, :start, :end)
    end
end
