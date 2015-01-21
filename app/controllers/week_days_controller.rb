class WeekDaysController < ApplicationController
  load_and_authorize_resource

  before_action :set_week_day, only: [:show, :edit, :update, :destroy]

  # GET /week_days
  # GET /week_days.json
  def index
    @week_days = WeekDay.all
  end

  # GET /week_days/1
  # GET /week_days/1.json
  def show
  end

  # GET /week_days/new
  def new
    @week_day = WeekDay.new
  end

  # GET /week_days/1/edit
  def edit
  end

  # POST /week_days
  # POST /week_days.json
  def create
    @week_day = WeekDay.new(week_day_params)

    respond_to do |format|
      if @week_day.save
        format.html { redirect_to @week_day, notice: 'Week day was successfully created.' }
        format.json { render :show, status: :created, location: @week_day }
      else
        format.html { render :new }
        format.json { render json: @week_day.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /week_days/1
  # PATCH/PUT /week_days/1.json
  def update
    respond_to do |format|
      if @week_day.update(week_day_params)
        format.html { redirect_to @week_day, notice: 'Week day was successfully updated.' }
        format.json { render :show, status: :ok, location: @week_day }
      else
        format.html { render :edit }
        format.json { render json: @week_day.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /week_days/1
  # DELETE /week_days/1.json
  def destroy
    @week_day.destroy
    respond_to do |format|
      format.html { redirect_to week_days_url, notice: 'Week day was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_week_day
      @week_day = WeekDay.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def week_day_params
      params.require(:week_day).permit(:day)
    end
end
