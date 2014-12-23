#!/usr/bin/env ruby
require_relative "../config/environment"

include Clockwork

every(30.minutes, 'finish_and_pay_appointments', :at => ['**:30', '**:00']) {

  # Marcar como completadas las clases que ya acabaron

  pending_appointment = AppointmentStatus.find_by_code("0")
  confirmed_appointment = AppointmentStatus.find_by_code("3")
  completed_appointment = AppointmentStatus.find_by_code("6")
  rejected_by_tutor = AppointmentStatus.find_by_code("2")
  valid_anomaly = RegisteredAnomalyStatus.find_by_code("1")

  Appointment.where("appointments.appointment_status_id = ? AND appointments.end < ?", confirmed_appointment.id, Time.now).each do |appointment|
    appointment.update_attribute(:appointment_status_id, completed_appointment.id) 
  end
  
  # Cancelar - clases que siguen pendientes y no se han confirmado 
  Appointment.where("appointments.appointment_status_id = ? AND appointments.start < ?", pending_appointment.id, Time.now + Appointment.hours_before_confirming.hour).each do |appointment|
    appointment.update_attribute(:appointment_status_id, rejected_by_tutor.id) 
  end

  # Cobrar y pagar las clases sin anomalías, y pagar las que tengan anomalías resueltas
  Appointment.where("appointments.appointment_status_id = ? AND appointments.charged = ? AND appointments.paid = ? AND appointments.end < ?", completed_appointment.id, false, false, Time.now - Appointment.hours_afer_business_rules.hour).each do |appointment|
    if not appointment.anomaly
      # pagar el appointment
      appointment.pay 100, 80
    elsif appointment.anomaly and appointment.resolved_anomaly
      #Busca que anomalía es para pagar con la resolución
      appointment.registered_anomalies.each do |ra|
        if ra.registered_anomaly_status == valid_anomaly
          # pagar el appointment
          if ra.fee_student and ra.fee_tutor and ra.fee_student > 0 and ra.fee_tutor > 0
            appointment.pay ra.fee_student, ra.fee_tutor
          end
        end
      end
    end
    
  end

}
