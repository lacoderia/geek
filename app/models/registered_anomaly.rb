class RegisteredAnomaly < ActiveRecord::Base
  belongs_to :anomaly
  belongs_to :user
  belongs_to :appointment
  belongs_to :source, :foreign_key => "source_id", :class_name => "User"
  belongs_to :registered_anomaly_status

  after_create :resolve_other_anomaly

  def resolve_other_anomaly
    other_anomaly = Anomaly.find_by_code "3"
    valid_anomaly_status = RegisteredAnomalyStatus.find_by_code "1"
    if self.anomaly_id == other_anomaly.id and self.registered_anomaly_status_id == valid_anomaly_status.id
      self.assign self.fee_student, self.fee_tutor
    end
  end

  def self.from_student appointment_id, anomaly_code, description
    anomaly = Anomaly.find_by_code(anomaly_code)
    appointment = Appointment.find(appointment_id)
    appointment.update_attribute(:anomaly, true)
    #Creada con pending registered anomaly status
    ra = RegisteredAnomaly.create(anomaly_id: anomaly.id, user_id: appointment.tutor.user.id, source_id: appointment.student.user.id, appointment_id: appointment.id, description: description, registered_anomaly_status_id: 1)
    ra.update_fees
    return ra
  end

  def self.from_tutor appointment_id, anomaly_code, description
    anomaly = Anomaly.find_by_code(anomaly_code)
    appointment = Appointment.find(appointment_id)
    appointment.update_attribute(:anomaly, true)
    #Creada con pending registered anomaly status
    ra = RegisteredAnomaly.create(anomaly_id: anomaly.id, user_id: appointment.student.user.id, source_id: appointment.tutor.user.id, appointment_id: appointment.id, description: description, registered_anomaly_status_id: 1)
    ra.update_fees
    return ra
  end

  def self.cancelled_from_student appointment
    
    #Cambiando por #24490987710030
    if ((appointment.start - Time.now)/3600) <= Appointment.hours_before_cancelling_anomaly # cancelando de ultima hora, entre 0 y 2 horas
      anomaly = Anomaly.find_by_code "4"

      appointment.update_attribute(:anomaly, true)
      description = "Cancelada por estudiante"
      ra = RegisteredAnomaly.create(anomaly_id: anomaly.id, user_id: appointment.student.user.id, source_id: appointment.student.user.id, appointment_id: appointment.id, description: description, registered_anomaly_status_id: 1)
      ra.assign

    end
  end

  def self.cancelled_from_tutor appointment

    #Cambiando por #24490987710030
    if ((appointment.start - Time.now)/3600) <= Appointment.hours_before_cancelling_anomaly # cancelando de ultima hora, entre 0 y 2 horas

      anomaly = Anomaly.find_by_code "2"
      appointment.update_attribute(:anomaly, true)
      description = "Cancelada por tutor"
      ra = RegisteredAnomaly.create(anomaly_id: anomaly.id, user_id: appointment.tutor.user.id, source_id: appointment.tutor.user.id, appointment_id: appointment.id, description: description, registered_anomaly_status_id: 1)
      ra.assign
    end
  end

  def self.assign_other appointment_id, user_id, description, fee_student, fee_tutor
    other_anomaly = Anomaly.find_by_code "3"
    ra = RegisteredAnomaly.create(anomaly_id: other_anomaly.id, user_id: user_id, appointment_id: appointment_id, description: description, registered_anomaly_status_id: 1)
    ra.assign fee_student, fee_tutor
    return ra
  end

  # Asigna estatus de valido al que la llama, y asigna estatus de rechazada a otras anomalías sobre el mismo appointment
  # también se encarga de cobrar
  def assign_helper fee_student = nil, fee_tutor = nil, absolute_amount = false
    valid_anomaly_status = RegisteredAnomalyStatus.find_by_code("1")
    invalid_anomaly_status = RegisteredAnomalyStatus.find_by_code("2")

    # Pagar el appointment
    if fee_student and fee_tutor
      if not (fee_student == 0)
        if (fee_student > 0 and fee_student <= 100) and (fee_tutor >= 0 and fee_tutor <= 100) and (not absolute_amount)
          self.appointment.pay fee_student, fee_tutor
        elsif absolute_amount
          self.appointment.pay_student_penalty fee_student
        else
          raise "Se intenta cobrar o pagar una comision incorrecta. Clase #{self.appointment_id} fee_student #{fee_student} fee_tutor #{fee_tutor} absolute_amount #{absolute_amount}"
        end
      end
    end
    
    self.update_attributes({:registered_anomaly_status_id => valid_anomaly_status.id, :fee_student => fee_student, :fee_tutor => fee_tutor }) 
    
    self.appointment.update_attribute(:resolved_anomaly, true)

    #Invalida todas las otras anomalías registradas a ese mismo appointment
    self.appointment.registered_anomalies.where("id != ?", self.id).each do |ra|
      ra.update_attribute(:registered_anomaly_status_id, invalid_anomaly_status.id)
    end
  end

  def update_fees
    case self.anomaly.code
    #when "0" #late show
    #  self.update_attributes({:fee_student => 100, :fee_tutor => 80}) 
    when "1" #no show
      if self.source.client_type == "Student"
        # El tutor no llegó, no se cobra y se cambia a válida
        self.update_attributes({:fee_student => 0, :fee_tutor => 0}) 
      elsif self.source.client_type == "Tutor"
        # El estudiante no llegó, se cobra 100 pesos, se pagan completos a Geek y se cambia a válida
        self.update_attributes({:fee_student => 100, :fee_tutor => 0}) 
      end
    when "2" #cancelacion por tutor, entre 2 y 0 horas
      self.update_attributes({:fee_student => 0, :fee_tutor => 0}) 
      
      #if self.user.client_type == "Tutor"
        # El tutor canceló, no se cobra y se cambia a válida
      #  self.update_attributes({:fee_student => 0, :fee_tutor => 0}) 
      #elsif self.user.client_type == "Student"
        # El estudiante canceló, se cobra el 25%, se asigna 50% al tutor y se cambia a válida
      #  self.update_attributes({:fee_student => 25, :fee_tutor => 50}) 
      #end
    when "4" #Cancelada por estudiante, entre 2 y 0 horas
      self.update_attributes({:fee_student => 0, :fee_tutor => 0}) 

      #if self.user.client_type == "Student"
        # El estudiante canceló, se cobra el 50%, se asigna 50% al tutor y se cambia a válida
      #  self.update_attributes({:fee_student => 50, :fee_tutor => 50}) 
      #else
        #Este caso no debería de pasar
      #  raise "Caso de cancelado por estudiante donde el user no es él mismo"
      #end
    end

  end

  def assign fee_student = nil, fee_tutor = nil

    valid_anomaly_status = RegisteredAnomalyStatus.find_by_code("1")
    
    case self.anomaly.code
    #when "0" #late show
      # Se cobra normal y cambia a válida
    #  self.assign_helper 100, 80 
    #  self.user.update_attribute(:late_shows, self.user.late_shows + 1)
    when "1" #no show
      if self.source.client_type == "Student"
        # El tutor no llegó, no se cobra y se cambia a válida
        self.assign_helper 0, 0
      elsif self.source.client_type == "Tutor"
        # El estudiante no llegó, se cobran 100 pesos, no se asigna nada al tutor y se cambia a válida
        self.assign_helper 100, 0, true
      end
      self.user.update_attribute(:no_shows, self.user.no_shows + 1)
    when "2" #cancelacion por tutor, entre 0 y 2 horas
      #if self.user.client_type == "Tutor"
        # El tutor canceló, no se cobra y se cambia a válida
      #  self.assign_helper 0, 0
      #elsif self.user.client_type == "Student"
        # El estudiante canceló, se cobra el 25%, se asigna 50% al tutor y se cambia a válida
      #  self.assign_helper 25, 50
      #end   
      self.assign_helper 0, 0
      self.user.update_attribute(:cancellations, self.user.cancellations + 1)
    when "3" #otro
      if fee_student and fee_tutor
        self.assign_helper fee_student, fee_tutor
      else
        raise 'Resolución de tipo OTRO necesita fee de estudiante y de tutor'
      end
    when "4" #Cancelada por estudiante, entre 2 y 0 horas
      #if self.user.client_type == "Student"
        # El estudiante canceló, se cobra el 50%, se asigna 50% al tutor y se cambia a válida
      #  self.assign_helper 50, 50
      #  self.user.update_attribute(:cancellations, self.user.cancellations + 1)
      #else
        #Este caso no debería de pasar
      #  raise "Caso de cancelado por estudiante donde el user no es él mismo"
      #end
      self.assign_helper 0, 0
      self.user.update_attribute(:cancellations, self.user.cancellations + 1)
    end
  end
  
  def reject

    invalid_anomaly_status = RegisteredAnomalyStatus.find_by_code("2")
    self.update_attributes({:registered_anomaly_status_id => invalid_anomaly_status.id}) 

    resolved_by_rejection = true
    self.appointment.registered_anomalies.where("id != ?", self.id).each do |ra|
      if ra.registered_anomaly_status_id != invalid_anomaly_status.id
        resolved_by_rejection = false
      end
    end

    if resolved_by_rejection
      self.appointment.update_attribute(:resolved_anomaly, true)
    end

  end

end
