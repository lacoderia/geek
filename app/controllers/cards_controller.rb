class CardsController < ApplicationController
  before_action :set_card, only: [:show, :edit, :update, :destroy]
  skip_before_filter :verify_authenticity_token, :only => [:register_new]

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
  # token- el token de la tarjeta generado por Openpay
  def register_new
  	@card = Card.register_card(params[:student_id], params[:token])
  end

  private

    def card_params
      params.require(:card).permit(:openpay_id, :token_id, :alias, :student_id, :active)
    end
end

