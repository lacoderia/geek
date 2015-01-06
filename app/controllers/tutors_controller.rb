class TutorsController < ApplicationController
  before_action :set_tutor, only: [:show, :edit, :update, :destroy]

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
      if params[:categories]
        @tutor.categories.destroy_all
        params[:categories].each do | cat |
          persisted = Category.find_by_name(I18n.transliterate(cat[:name]).downcase)
          # AGREGAR COSTO
          if persisted
            @tutor.categories_tutors << CategoriesTutor.create(:tutor_id => @tutor.id, :category_id => persisted.id, :cost => cat[:cost])
          else
            category = Category.create(:name => I18n.transliterate(cat[:name]).downcase, :category_id => cat[:category_id])
            @tutor.categories_tutors << CategoriesTutor.create(:tutor_id => @tutor.id, :category_id => category.id, :cost => cat[:cost])
          end
        end
      end
      if params[:counties]
        @tutor.counties.destroy_all
        params[:counties].each do |county|
          @tutor.counties << County.find(county[:id])
        end
      end
      if params[:preference]
        @tutor.preference.update_attributes({:cost => params[:preference][:cost], :public => params[:preference][:public], :office => params[:preference][:office], :online => params[:preference][:online], :student_place => params[:preference][:student_place]})
      end
      if params[:picture]
        if @tutor.picture_id
          Cloudinary::Api.delete_resources(["#{@tutor.picture_id}"])
        end
        image = Cloudinary::Uploader.upload(params[:picture], :width => 375, :height => 800, :crop => :limit)
        @tutor.update_attributes({:picture_url => image["url"], :picture_id => image["public_id"]})
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
  # category_id = ID de la categoria o subcategoría
  # Regresa:
  # Arreglo de tutores que coincidieron con el criterio de búsqueda
  def by_county_and_category_ids
    @tutors = Tutor.search_by_query_params(params[:county_id], params[:zone_str], params[:category_id], params[:category_str]) 
  end

  # Recibe:
  # zone_obj = objeto de google que se conforma por :neighborhood, :postal_code, :sublocality, :locality
  # category_id = ID de la categoría o subcategoría
  # category_str = texto para búsqueda de categoría
  # Regresa:
  # Objeto con arreglo de tutores que conforman la búsqueda, arreglo de tutores sugeridos con fallback, y mensaje descriptivo.
  def by_query_params_for_google
    @result_obj = Tutor.search_by_query_params_for_google(params[:zone_obj], params[:category_id], params[:category_str], params[:page])
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
  # start_day = numero de dia inicial 
  # start_month = numero de mes inicial
  # start_year = numero de año inicial
  # end_day = numero de dia final
  # end_month = numero de mes final
  # end_year = numero de año final
  # id = id del tutor
  # Regresa:
  # hash con días del mes, con una lista de horarios
  def ranged_availability_list
    @availability_list = Tutor.ranged_availability_list(params[:id], params[:start_day].to_i, params[:start_month].to_i, params[:start_year].to_i, params[:end_day].to_i, params[:end_month].to_i, params[:end_year].to_i)
  end

  # Recibe:
  # start = fecha de inicio en formato iso8601 (toISOString en JS). Ej 6:30pm, 10 nov 2014 CST ("2014-11-10T18:30:00")
  # length = numero de horas que dura la clase (min: 1) 
  # id = id del tutor
  # student_id = id del estudiante
  # description = descripcion de la clase
  # cost = el costo de la clase
  # Regresa:
  # success: true si la pudo agendar, false si no se pudo crear
  def request_class
    @request = Tutor.request_class(params[:id], params[:start], params[:length].to_i, params[:student_id], params[:description], params[:cost])
  end

  # Recibe:
  # id = id del tutor
  # availabilities = arreglo de hash de disponibilidades [{day:'monday', start: '13:00', end:'14:00'}]
  # Regresa:
  # lista de objetos availabilities del tutor
  def save_availabilities
    @availabilities = Tutor.save_availabilities(params[:id], params[:availabilities])
  end

  # Recibe:
  # id = id del tutor
  # specific_availabilities = arreglo de hash de disponibilidades en formato iso8601 [{start: '2014-11-10T18:30:00', end: '2014-11-10T19:30:00' }]
  # Regresa:
  # lista de objetos specific_availabilities del tutor
  def save_specific_availabilities
    @specific_availabilities = Tutor.save_specific_availabilities(params[:id], params[:specific_availabilities]) 
  end

  # Obtiene información del tutor loggeado
  # Regresa:
  # tutor un objeto tutor con la información 
  def profile
    #@tutor = Tutor.last
    if current_user
      @tutor = Tutor.profile(current_user.email)
    end
  end

  # Obtiene información acerca del estado del tutor
  # Regresa:
  # tutor un objeto tutor con la información de si tiene autorización y si envió su solicitud
  def status
    if current_user
      @tutor = Tutor.status(current_user.email)
    end
  end

  # Obtiene los tutores con los que un estudiante ha tomado clases
  # Recibe:
  # student_id - el ID del estudiante
  # Regresa: lista de tutores
  def by_student
    if params[:student_id]
      @student = Student.find(params[:student_id])
      @tutors = Tutor.by_student(@student)
    end
  end

  # Obtiene el saldo en Openpay de un tutor
  # Regresa:
  # Un hash con el saldo y el medio de pago (tarjeta o cuenta bancaria) del tutor
  def balance
    if current_user
      @balance = Tutor.get_balance(current_user.openpay_id)
      @card = Card.get_active(current_user.id)
      if @card
         @openpay_card = @card.get_openpay_info
      end
    end
  end

  # Realiza una transferencia de la cuenta en Openpay del tutor a su cuenta bancaria o tarjeta de débito
  def cash_out
    if current_user
      tutor = Tutor.where("email = ?", current_user.email)[0]
      cash_out = Tutor.cash_out(tutor.id)
      if cash_out[:success]
        render json: "ok", status: :ok
      else
        render json: cash_out[:error], status: 500
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_tutor
      @tutor = Tutor.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def tutor_params
      params.permit(:first_name, :last_name, :details, :references, :background, :calendar_id, :bank_account_id, :gender, :phone_number, :grade)
    end
end
