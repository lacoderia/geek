class Appointment < ActiveRecord::Base
  belongs_to :appointment_status
  belongs_to :student
  belongs_to :tutor
  belongs_to :address
  has_many :registered_anomalies
  accepts_nested_attributes_for :registered_anomalies

  @@hours_before_cancelling_anomaly = 2
  @@hours_after_business_rules = 12
  @@hours_after_business_rules_max = 2

  cattr_reader :hours_after_business_rules, :hours_after_business_rules_max, :hours_before_cancelling_anomaly

  def appointment_updated status
    case status.code
    when "1" #rechazada estudiante
      self.tutor.delete_appointment self 
    when "2" #rechazada tutor
      self.tutor.delete_appointment self 
      UserMailer.student_appointment_request_rejected(self).deliver
    when "3" #confirmada
      UserMailer.student_appointment_request_accepted(self).deliver
      UserMailer.tutor_appointment_confirmed(self).deliver
    when "4" #cancelada estudiante
      # Reportar anomalía
      RegisteredAnomaly.cancelled_from_student self
      self.tutor.delete_appointment self 
      UserMailer.tutor_appointment_canceled(self).deliver
    when "5" #cancelada tutor
      RegisteredAnomaly.cancelled_from_tutor self
      self.tutor.delete_appointment self 
      UserMailer.student_appointment_canceled(self).deliver
    end 
  end

  #fee_student es normalmente 100
  def force_charge 

    fee_student = nil
    if not self.anomaly
      fee_student = 100
    elsif self.anomaly and self.resolved_anomaly
      #Busca que anomalía es para pagar con la resolución
      self.registered_anomalies.each do |ra|
        if ra.registered_anomaly_status == valid_anomaly
          # pagar el appointment
          if ra.fee_student and ra.fee_tutor and ra.fee_student > 0 and ra.fee_tutor > 0
            fee_student = ra.fee_student
          end
        end
      end
    end
    
    student_openpay_id = self.student.openpay_id 
    card_id = self.student.cards.where("active = ?", true).first.openpay_id
    amount = (self.cost * (fee_student/100.0)) 

    chargestudent = Payment.charge_student student_openpay_id, card_id, amount, get_charge_message
    if chargestudent[:error]
      self.update_attribute(:log, chargestudent[:error].description)
    else
      self.update_attribute(:charged, true)
    end

  end

  #fee student es normalmente 100, fee_tutor es normalmente 80
  def force_pay
  
    fee_student = nil
    fee_tutor = nil
    if not self.anomaly
      fee_student = 100
      fee_tutor = 80
    elsif self.anomaly and self.resolved_anomaly
      #Busca que anomalía es para pagar con la resolución
      self.registered_anomalies.each do |ra|
        if ra.registered_anomaly_status == valid_anomaly
          # pagar el appointment
          if ra.fee_student and ra.fee_tutor and ra.fee_student > 0 and ra.fee_tutor > 0
            fee_student = ra.fee_student
            fee_tutor = ra.fee_tutor
          end
        end
      end
    end
    
    student_openpay_id = self.student.openpay_id 
    tutor_openpay_id = self.tutor.openpay_id
    amount = (self.cost * (fee_student/100.0)) 

    transferfunds = Payment.transfer_funds student_openpay_id, tutor_openpay_id, amount, get_transfer_message 
    collectfee = Payment.charge_fee tutor_openpay_id, (amount * ((100.0-fee_tutor)/100.0)), get_fee_message 
    self.update_attribute(:paid, true)

  end

  def pay_student_penalty fee_student
    student_openpay_id = self.student.openpay_id
    card_id = self.student.cards.where("active = ?", true).first.openpay_id
    amount = (fee_student * 1.16).round(2) #se suma el IVA
    chargestudent = Payment.charge_student student_openpay_id, card_id, amount, get_student_penalty_message, false

    if chargestudent[:error]
      logger.info(chargestudent.to_yaml)
      self.update_attribute(:log, chargestudent[:error].description)
    else
      self.update_attribute(:charged, true)
      collectfee = Payment.charge_fee student_openpay_id, amount, get_fee_penalty_message
    end
  end

  def pay fee_student, fee_tutor
    student_openpay_id = self.student.openpay_id 
    tutor_openpay_id = self.tutor.openpay_id
    card_id = self.student.cards.where("active = ?", true).first.openpay_id
    #account_id = self.tutor.cards.where("active = ?", true).first.openpay_id
    amount = (self.cost * (fee_student/100.0)) 

    chargestudent = Payment.charge_student student_openpay_id, card_id, amount, get_charge_message # (total a cobrar del estudiante, con operanciones con fee_student)
    #actualizar bandera de cobrado
    if chargestudent[:error]
      self.update_attribute(:log, chargestudent[:error].description)
    else
      self.update_attribute(:charged, true)

      transferfunds = Payment.transfer_funds student_openpay_id, tutor_openpay_id, amount, get_transfer_message # (cantidad menos comisión de Openpay ?)
      collectfee = Payment.charge_fee tutor_openpay_id, (amount * ((100.0-fee_tutor)/100.0)), get_fee_message # (comisión de GEEK)
      # actualizar bandera de pagado
      self.update_attribute(:paid, true)
      
      #paytutor = Payment.pay_tutor tutor_openpay_id, account_id, (amount * ((fee_tutor)/100.0)) #(total a pagar después de la comisión de GEEK)
    end

  end

  def self.get_latest_by_tutor tutor_id, status_id
    total = Appointment.where('tutor_id = ? and appointment_status_id = ?', tutor_id, status_id).size
    appointments = Appointment.where('tutor_id = ? and appointment_status_id = ?', tutor_id, status_id).includes(:student).last(3).reverse
    {:total => total, :appointments => appointments}
  end

  def self.get_latest_by_student student_id, status_id
    total = Appointment.where('student_id = ? and appointment_status_id = ?', student_id, status_id).size
    appointments = Appointment.where('student_id = ? and appointment_status_id = ?', student_id, status_id).includes(:tutor).last(3).reverse
    {:total => total, :appointments => appointments}
  end

  def get_student_penalty_message
    "Cobro de penalización. Estudiante " + self.student.id.to_s + ", Clase: " + self.id.to_s
  end

  def get_fee_penalty_message
    "Cobro de comisión por penalización. Estudiante " + self.student.id.to_s + ", Clase: " + self.id.to_s
  end

  def get_charge_message
    "Cobro de clase. Estudiante: " + self.student.id.to_s + ", Clase: " + self.id.to_s
  end

  def get_transfer_message
    "Pago de clase. Tutor: " + self.tutor.id.to_s + ", Clase: " + self.id.to_s
  end

  def get_fee_message
    "Cobro de comisión por clase. Tutor " + self.tutor.id.to_s + ", Clase: " + self.id.to_s
  end

end
