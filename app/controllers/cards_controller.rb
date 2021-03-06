class CardsController < ApplicationController
  load_and_authorize_resource :except => [:register_card, :register_bank_account, :delete_card, :by_user, :activate]

  before_action :set_card, only: [:show, :edit, :update, :destroy]

  # GET /cards
  # GET /cards.json
  def index
    @cards = Card.all
  end

  # GET /cards/1
  # GET /cards/1.json
  def show
  end

  # GET /cards/new
  def new
    @card = Card.new
  end

  # GET /cards/1/edit
  def edit
  end

  # POST /cards
  # POST /cards.json
  def create
    @card = Card.new(card_params)

    respond_to do |format|
      if @card.save
        format.html { redirect_to @card, notice: 'card was successfully created.' }
        format.json { render :show, status: :created, location: @card }
      else
        format.html { render :new }
        format.json { render json: @card.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /cards/1
  # PATCH/PUT /cards/1.json
  def update
    respond_to do |format|
      if @card.update(card_params)
        format.html { redirect_to @card, notice: 'card was successfully updated.' }
        format.json { render :show, status: :ok, location: @card }
      else
        format.html { render :edit }
        format.json { render json: @card.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /cards/1
  # DELETE /cards/1.json
  def destroy
    @card.destroy
    respond_to do |format|
      format.html { redirect_to cards_url, notice: 'card was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  # Crea una tarjeta y la asocia a un usuario
  # Recibe:
  # student_id - el id del estudiante al que se registra la tarjeta
  # tutor_id - el id del tutor al que se registra la tarjeta
  # token- el token de la tarjeta generado por Openpay
  def register_card
  	if params[:tutor_id]
      user = Tutor.find(params[:tutor_id]).user
    elsif params[:student_id]
      user = Student.find(params[:student_id]).user
    end
  	@card = Card.register_card(user, params[:token], params[:session_id])
  end

  # Crea una cuenta bancaria y la asocia a un usuario
  # Recibe:
  # tutor_id - el id del tutor al que se registra la cuenta bancaria
  # clabe - la cuenta clabe del usuario
  # holder_name - nombre del titular de la cuenta
  def register_bank_account
  	user = Tutor.find(params[:tutor_id]).user
    result = Card.register_bank_account(user, params[:clabe], params[:holder_name]) 
    if (result[:error].nil?)
  	   @card = result[:card]
    else
      render json: result[:error], status: 500
    end
  end

  # Borra un medio de pago
  # Recibe:
  # student_id - el id del estudiante 
  # tutor_id - el id del tutor
  # card_id - el id de la tarjeta o cuenta bancaria
  def delete_card
    if params[:tutor_id]
      user = Tutor.find(params[:tutor_id]).user
    elsif params[:student_id]
      user = Student.find(params[:student_id]).user
    end
    result = Card.delete_card(user, params[:card_id])
    if result[:success] == true
      render json: "", status: :ok
    else
      render json: result[:error], status: 500
    end
  end

  # Obtiene los medios de pago de un usuario
  # Recibe:
  # student_id - el id del estudiante 
  # tutor_id - el id del tutor 
  def by_user
  	if params[:tutor_id]
      user = Tutor.find(params[:tutor_id]).user
    elsif params[:student_id]
      user = Student.find(params[:student_id]).user
    end
    @cards = Card.find_by_user(user)
  end

  # Selecciona una opción de pago/cobro como activa
  # Recibe:
  # id - el id de la forma de pago
  def activate
  	@card = Card.activate(params[:id])
  end

  private

    def card_params
      params.require(:card).permit(:openpay_id, :token_id, :alias, :student_id, :active)
    end
end

