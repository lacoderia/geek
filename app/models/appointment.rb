class Appointment < ActiveRecord::Base
  belongs_to :appointment_status
  belongs_to :student
  belongs_to :tutor
  belongs_to :address
  has_many :registered_anomalies

  def update_cancelled_rejected_appointment status
    case status.code
    when "1" #rechazada estudiante
      self.delete_and_send_emails 
    when "2" #rechazada tutor
      self.delete_and_send_emails 
    when "4" #cancelada estudiante
      # Reportar anomalía
      RegisteredAnomaly.cancelled_from_student self
      self.delete_and_send_emails 
    when "5" #cancelada tutor
      RegisteredAnomaly.cancelled_from_tutor self
      self.delete_and_send_emails 
    end 
  end

  def delete_and_send_emails
    self.tutor.delete_appointment self 
    # Envio de correos solo en produccion 
    if Rails.env.production?
      UserMailer.tutor_notification_email(self.tutor_id, self.appointment_status_id, self.subject).deliver
      UserMailer.student_notification_email(self.student_id, self.appointment_status_id, self.subject).deliver
    end
  end
end
