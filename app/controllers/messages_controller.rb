class MessagesController < ApplicationController
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
    query = "select * from messages where id in (select id from (select max(id) as id, student_id, tutor_id from messages where #{condition} = #{value} group by student_id, tutor_id) as sub)"
    @messages = Message.find_by_sql(query)
  end

  # Obtiene los mensajes de una conversación
  # Recibe:
  #   student_id - El ID del estudiante
  #   tutor_id - El ID del tutor
  # Regresa una lista de mensajes entre el tutor y el estudiante
  def by_conversation
    tutor_id = params[:tutor_id]
    student_id = params[:student_id]
    @messages = Message.where('student_id = ? and tutor_id = ?', student_id, tutor_id).order(created_at: :desc) 
  end

  # Marca los mensajes de una conversación como leidos
  # Recibe:
  #   message_id - el ID del mensaje más reciente de la conversación
  def mark_read
    msg = Message.find(params[:message_id])
    Message.where("id <= #{msg.id} and tutor_id = #{msg.tutor_id} and student_id = #{msg.student_id}").update_all("read = true")
    render json: "", status: :ok
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_message
      @message = Message.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def message_params
      params.require(:message).permit(:sender_id, :recipient_id, :text, :status)
    end
end
