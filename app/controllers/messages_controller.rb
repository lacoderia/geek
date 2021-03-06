class MessagesController < ApplicationController
  load_and_authorize_resource :except => [:new, :create, :conversations, :by_conversation, :mark_read, :pending_conversations]

  before_action :set_message, only: [:show, :edit, :update, :destroy]

  # GET /messages
  # GET /messages.json
  def index
    @messages = Message.all
  end

  # GET /messages/1
  # GET /messages/1.json
  def show
  end

  # GET /messages/new
  def new
    @message = Message.new
  end

  # GET /messages/1/edit
  def edit
  end

  # POST /messages
  # POST /messages.json
  def create
    @message = Message.new(message_params)

    respond_to do |format|
      if @message.save
        format.html { redirect_to @message, notice: 'Message was successfully created.' }
        format.json { render :show, status: :created, location: @message }
      else
        format.html { render :new }
        format.json { render json: @message.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /messages/1
  # PATCH/PUT /messages/1.json
  def update
    respond_to do |format|
      if @message.update(message_params)
        format.html { redirect_to @message, notice: 'Message was successfully updated.' }
        format.json { render :show, status: :ok, location: @message }
      else
        format.html { render :edit }
        format.json { render json: @message.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /messages/1
  # DELETE /messages/1.json
  def destroy
    @message.destroy
    respond_to do |format|
      format.html { redirect_to messages_url, notice: 'Message was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  # Obtiene las conversaciones de un usuario
  # Recibe cualquier de estos parámetros:
  #   student_id - El ID del estudiante 
  #   tutor_id - El ID del tutor
  # Regresa una lista de conversaciones entre estudiantes y tutores
  def conversations
    if params[:tutor_id]
      condition = 'tutor_id'
      value = params[:tutor_id]
    elsif params[:student_id]
      condition = 'student_id'
      value = params[:student_id]
    end 
    @messages = Message.get_conversations(condition, value)
  end

  # Obtiene los mensajes de una conversación
  # Recibe:
  #   student_id - El ID del estudiante
  #   tutor_id - El ID del tutor
  # Regresa una lista de mensajes entre el tutor y el estudiante
  def by_conversation
    student_id = params[:student_id]
    tutor_id = params[:tutor_id]
    @messages = Message.get_conversation(student_id, tutor_id)
  end

  # Marca los mensajes de una conversación como leidos
  # Recibe:
  #   message_id - el ID del mensaje más reciente de la conversación
  def mark_read
    Message.mark_read(params[:message_id])
    render json: "", status: :ok
  end

  # Obtiene el número de conversaciones que tienen mensajes pendientes
  # Recibe:
  #   student_id - El ID del estudiante
  #   tutor_id - El ID del tutor
  # Regresa el número de conversaciones con mensajes pendientes
  def pending_conversations
    if params[:tutor_id]
      condition = 'tutor_id'
      id = params[:tutor_id]
    elsif params[:student_id]
      condition = 'student_id'
      id = params[:student_id]
    end
    @messages = Message.get_pending_conversations(condition, id)
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_message
      @message = Message.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def message_params
      params.require(:message).permit(:student_id, :tutor_id, :text, :read, :from_student)
    end
end
