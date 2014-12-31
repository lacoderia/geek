class Appointment < ActiveRecord::Base
  belongs_to :appointment_status
  belongs_to :student
  belongs_to :tutor
  belongs_to :address
  has_many :registered_anomalies
  accepts_nested_attributes_for :registered_anomalies

  #@@hours_before_scheduling = 24
  @@hours_before_confirming = 12
  @@hours_before_business_rules = 12
  @@hours_afer_business_rules = 12
  @@hours_afer_business_rules_max = 2

  cattr_reader :hours_before_scheduling, :hours_before_confirming, :hours_before_business_rules, :hours_afer_business_rules, :hours_afer_business_rules_max

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

  #fee_student es normalmente 100
  def force_charge 

    #fee_student = 
    #student_openpay_id = self.student.openpay_id 
    #card_id = self.student.cards.where("active = ?", true).first.openpay_id
    #amount = (self.cost * (fee_student/100.0)) 

    #chargestudent = Payment.charge_student student_openpay_id, card_id, amount 
    #if chargestudent[:error]
    #  self.update_attribute(:log, chargestudent[:error]["description"])
    #else
      self.update_attribute(:charged, true)
    #end

  end

  #fee student es normalmente 100, fee_tutor es normalmente 80
  def force_pay

    #fee_student =
    #fee_tutor = 
    
    #student_openpay_id = self.student.openpay_id 
    #tutor_openpay_id = self.tutor.openpay_id
    #amount = (self.cost * (fee_student/100.0)) 

    #transferfunds = Payment.transfer_funds student_openpay_id, tutor_openpay_id, amount 
    #collectfee = Payment.charge_fee tutor_openpay_id, (amount * ((100.0-fee_tutor)/100.0)) 
    self.update_attribute(:paid, true)

  end

  def pay fee_student, fee_tutor
    student_openpay_id = self.student.openpay_id 
    tutor_openpay_id = self.tutor.openpay_id
    card_id = self.student.cards.where("active = ?", true).first.openpay_id
    account_id = self.tutor.cards.where("active = ?", true).first.openpay_id
    amount = (self.cost * (fee_student/100.0)) 

    chargestudent = Payment.charge_student student_openpay_id, card_id, amount # (total a cobrar del estudiante, con operanciones con fee_student)
    #actualizar bandera de cobrado
    if chargestudent[:error]
      self.update_attribute(:log, chargestudent[:error]["description"])
    else
      self.update_attribute(:charged, true)

      transferfunds = Payment.transfer_funds student_openpay_id, tutor_openpay_id, amount # (cantidad menos comisión de Openpay ?)
      collectfee = Payment.charge_fee tutor_openpay_id, (amount * ((100.0-fee_tutor)/100.0)) # (comisión de GEEK)
      # actualizar bandera de pagado
      self.update_attribute(:paid, true)
      
      #paytutor = Payment.pay_tutor tutor_openpay_id, account_id, (amount * ((fee_tutor)/100.0)) #(total a pagar después de la comisión de GEEK)
    end

  end

end
