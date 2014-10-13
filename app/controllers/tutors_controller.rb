class TutorsController < ApplicationController
  before_action :set_tutor, only: [:show, :edit, :update, :destroy]
  skip_before_filter :verify_authenticity_token, :only => [:update]

  # GET /tutors
  # GET /tutors.json
  def index
    @tutors = Tutor.all
  end

  # GET /tutors/1
  # GET /tutors/1.json
  def show
  end

  # GET /tutors/new
  def new
    @tutor = Tutor.new
  end

  # GET /tutors/1/edit
  def edit
  end

  # POST /tutors
  # POST /tutors.json
  def create
    @tutor = Tutor.new(tutor_params)

    respond_to do |format|
      if @tutor.save
        format.html { redirect_to @tutor, notice: 'Tutor was successfully created.' }
        format.json { render :show, status: :created, location: @tutor }
      else
        format.html { render :new }
        format.json { render json: @tutor.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /tutors/1
  # PATCH/PUT /tutors/1.json
  def update
    respond_to do |format|
      if params[:tutor][:categories]
        params[:tutor][:categories].each do | cat |
          @tutor.categories << Category.find(cat[:id])
        end
      end
      if @tutor.update(tutor_params)
        format.html { redirect_to @tutor, notice: 'Tutor was successfully updated.' }
        format.json { render :show, status: :ok, location: @tutor }
      else
        format.html { render :edit }
        format.json { render json: @tutor.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /tutors/1
  # DELETE /tutors/1.json
  def destroy
    @tutor.destroy
    respond_to do |format|
      format.html { redirect_to tutors_url, notice: 'Tutor was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

	# Recibe:
	# county_id = ID de la colonia
	def by_county_id
		county_id = params[:county_id]
		@tutors = Tutor.joins(:counties).where("county_id = ?", county_id)
	end

	# Recibe:
	# month = numero de mes 
	# year = numero de año
	# id = id del tutor
	# Regresa:
	# hash con días del mes, con una lista de horarios
	def availability_list 
		@availability_list = Tutor.availability_list(params[:id], params[:month].to_i, params[:year].to_i)
	end

	# Recibe:
	# start = fecha de inicio en formato iso8601 (toISOString en JS). Ej 6:30pm, 10 nov 2014 CST ("2014-11-10T18:30:00-05:00")
	# length = numero de horas que dura la clase (min: 1) 
	# id = id del tutor
	# student_id = id del estudiante
	# description = descripcion de la clase
	# Regresa:
	# success: true si la pudo agendar, false si no se pudo crear
	def request_class
		@request = Tutor.request_class(params[:id], params[:start], params[:length].to_i, params[:student_id], params[:description])
	end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_tutor
      @tutor = Tutor.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def tutor_params
      params.require(:tutor).permit(:first_name, :last_name, :details, :references, :background, :preference_id, :calendar_id, :bank_account_id)
    end
end
