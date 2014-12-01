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

  def grant student_fee = nil, tutor_fee = nil
    case self.anomaly.code
    when "0" #late show
      puts "late show"
      self.update_attribute(:registered_anomaly_status_id, 1) # Se cambia a válida
    when "1" #no show
      puts "no show"
    when "2" #cancelacion
      puts "cancelacion"
    when "3" #otro
      if student_fee and tutor_fee
        puts "otro"
      else
        raise 'Resolución de tipo OTRO necesita fee de estudiante y de tutor'
      end
    end
  end

end
