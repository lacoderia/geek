class ReviewsController < ApplicationController
  load_and_authorize_resource :except => [:new, :create, :by_tutor, :activate]

  before_action :set_review, only: [:show, :edit, :update, :destroy]
  
  # GET /reviews
  # GET /reviews.json
  def index
    @reviews = Review.all
  end

  # GET /reviews/1
  # GET /reviews/1.json
  def show
  end

  # GET /reviews/new
  def new
    @review = Review.new
  end

  # GET /reviews/1/edit
  def edit
  end

  # POST /reviews
  # POST /reviews.json
  def create
    @review = Review.new(review_params)
    respond_to do |format|
      if @review.save
        Tutor.update_grade(@review.tutor_id)
        format.html { redirect_to @review, notice: 'Review was successfully created.' }
        format.json { render :show, status: :created, location: @review }
      else
        format.html { render :new }
        format.json { render json: @review.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /reviews/1
  # PATCH/PUT /reviews/1.json
  def update
    respond_to do |format|
      if @review.update(review_params)
        format.html { redirect_to @review, notice: 'Review was successfully updated.' }
        format.json { render :show, status: :ok, location: @review }
      else
        format.html { render :edit }
        format.json { render json: @review.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /reviews/1
  # DELETE /reviews/1.json
  def destroy
    @review.destroy
    respond_to do |format|
      format.html { redirect_to reviews_url, notice: 'Review was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  # Obtiene las evaluaciones de un tutor
  # Recibe:
  # tutor_id - el ID del tutor
  # Regresa una lista de evaluaciones
  def by_tutor
    if params[:tutor_id]
      @reviews = Review.by_tutor(params[:tutor_id])
    end
  end

  def activate
    review = Review.find(params[:id])
    if review 
      review.update_attribute(:visible, params[:activate])
      render json: {:review => review}
      return
    else
      render plain: "Error", status: 401
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_review
      @review = Review.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def review_params
      params.require(:review).permit(:student_id, :tutor_id, :grade_knowledge, :grade_communication, :grade_presentation, :description)
    end
end
