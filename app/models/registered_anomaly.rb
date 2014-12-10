class RegisteredAnomaly < ActiveRecord::Base
  belongs_to :anomaly
  belongs_to :user
  belongs_to :appointment
  belongs_to :source, :foreign_key => "source_id", :class_name => "User"
  belongs_to :registered_anomaly_status

  def self.from_student appointment_id, anomaly_code, description
    anomaly = Anomaly.find_by_code(anomaly_code)
    appointment = Appointment.find(appointment_id)
    #Creada con pending registered anomaly status
    RegisteredAnomaly.create(anomaly_id: anomaly.id, user_id: appointment.tutor.user.id, source_id: appointment.student.user.id, appointment_id: appointment.id, description: description, registered_anomaly_status_id: 1)
  end

  def self.from_tutor appointment_id, anomaly_code, description
    anomaly = Anomaly.find_by_code(anomaly_code)
    appointment = Appointment.find(appointment_id)
    #Creada con pending registered anomaly status
    RegisteredAnomaly.create(anomaly_id: anomaly.id, user_id: appointment.student.user.id, source_id: appointment.tutor.user.id, appointment_id: appointment.id, description: description, registered_anomaly_status_id: 1)

  end

  def self.cancelled_from_student appointment
    
    if ((appointment.start - Time.now)/3600) <= 2 # cancelando de ultima hora, entre 0 y 2 horas
      anomaly = Anomaly.find_by_code "4"
    elsif ((appointment.start - Time.now)/3600) <= 12 # cancelando entre 2 y 12 horas
      anomaly = Anomaly.find_by_code "2"
    end

    description = "Cancelada por estudiante"
    ra = RegisteredAnomaly.create(anomaly_id: anomaly.id, user_id: appointment.student.user.id, source_id: appointment.student.user.id, appointment_id: appointment.id, description: description, registered_anomaly_status_id: 1)
    ra.assign
  end

  def self.cancelled_from_tutor appointment
    anomaly = Anomaly.find_by_code "2"
    description = "Cancelada por tutor"
    ra = RegisteredAnomaly.create(anomaly_id: anomaly.id, user_id: appointment.tutor.user.id, source_id: appointment.tutor.user.id, appointment_id: appointment.id, description: description, registered_anomaly_status_id: 1)
    ra.assign
  end

  def assign fee_student = nil, fee_tutor = nil
    case self.anomaly.code
    when "0" #late show
      puts "late show"
      # Se cobra normal y cambia a válida
      self.update_attributes({:registered_anomaly_status_id => 2, :fee_student => 100, :fee_tutor => 100 }) 
    when "1" #no show
      puts "no show"
      if self.source.client_type == "Student"
        # El tutor no llegó, no se cobra y se cambia a válida
        self.update_attributes({:registered_anomaly_status_id => 2, :fee_student => 0, :fee_tutor => 0 }) 
      elsif self.source.client_type == "Tutor"
        # El estudiante no llegó, se cobra todo, se asigna 50% al tutor y se cambia a válida
        self.update_attributes({:registered_anomaly_status_id => 2, :fee_student => 100, :fee_tutor => 50 }) 
      end
    when "2" #cancelacion
      puts "cancelacion"
      if self.user.client_type == "Tutor"
        # El tutor canceló, no se cobra y se cambia a válida
        self.update_attributes({:registered_anomaly_status_id => 2, :fee_student => 0, :fee_tutor => 0 }) 
      elsif self.user.client_type == "Student"
        # El estudiante canceló, se cobra el 25%, se asigna 50% al tutor y se cambia a válida
        self.update_attributes({:registered_anomaly_status_id => 2, :fee_student => 25, :fee_tutor => 50 }) 
      end   
    when "3" #otro
      if fee_student and fee_tutor
        puts "otro"
        self.update_attributes({:registered_anomaly_status_id => 2, :fee_student => fee_student, :fee_tutor => fee_tutor }) 
      else
        raise 'Resolución de tipo OTRO necesita fee de estudiante y de tutor'
      end
    when "4" #Cancelada por estudiante, entre 2 y 0 horas
      puts "Cancelada por estudiante entre 2 y 0 horas"
      if self.user.client_type == "Student"
        # El estudiante canceló, se cobra el 50%, se asigna 50% al tutor y se cambia a válida
        self.update_attributes({:registered_anomaly_status_id => 2, :fee_student => 50, :fee_tutor => 50 }) 
      else
        #Este caso no debería de pasar
        raise "Caso de cancelado por estudiante donde el user no es él mismo"
      end
    end
  end

end
