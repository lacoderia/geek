class Appointment < ActiveRecord::Base
  belongs_to :appointment_status
  belongs_to :student
  belongs_to :tutor
  belongs_to :address
  has_many :registered_anomalies
  accepts_nested_attributes_for :registered_anomalies

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

  def process_payment
  	if self.appointment_status.code == 6
  		#chargestudent = Payment.charge_student  student_id, card_id, self.cost
  		#paytutor = Payment.pay_tutor tutor_id, account_id, self.cost
  		#collectfee = Payment.charge_fee tutor_id, (self.cost * 0.8)
  		puts 'cobrale al estudiante y paga al tutor'
  	elsif self.appointment_status.code == 9 && self.get_valid_anomalies.size > 0
  		anomaly = self.get_valid_anomalies[0]
  		#chargestudent = Payment.charge_student  student_id, card_id, (self.cost * (anomaly.fee_student/100))
  		#paytutor = Payment.pay_tutor tutor_id, account_id, self.cost
  		#collectfee = Payment.charge_fee tutor_id, (self.cost * (anomaly.fee_tutor/100))
  		puts 'cobrale al estudiante y paga al tutor con anomalia'
  	else
  		puts 'no puedo cobrar'
  	end
  end

  # card_id = fuente
  # acocunt_id = destino
  def pay fee_student, fee_tutor
    student_openpay_id = self.student.openpay_id 
    tutor_openpay_id = self.tutor.openpay_id
    card_id = self.student.cards.where("active = ?", true).first.openpay_id
    account_id = self.tutor.cards.where("active = ?", true).first.openpay_id
    amount = (self.cost * (fee_student/100.0)) 

    chargestudent = Payment.charge_student student_openpay_id, card_id, amount # (total a cobrar del estudiante, con operanciones con fee_student)
    #actualizar bandera de cobrado
    self.update_attribute(:charged, true)

    transferfunds = Payment.transfer_funds student_openpay_id, tutor_openpay_id, amount # (cantidad menos comisión de Openpay ?)
    collectfee = Payment.charge_fee tutor_openpay_id, (amount * ((100.0-fee_tutor)/100.0)) # (comisión de GEEK)
    paytutor = Payment.pay_tutor tutor_openpay_id, account_id, (amount * ((fee_tutor)/100.0)) #(total a pagar después de la comisión de GEEK)
    # actualizar bandera de pagado
    self.update_attribute(:paid, true)
  end

  private
  def get_valid_anomalies
		anomalies = self.registered_anomalies.select{ |anomaly| anomaly.registered_anomaly_status.code == 1}
		return anomalies
	end
end
