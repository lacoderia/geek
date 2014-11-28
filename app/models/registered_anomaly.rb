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
end
