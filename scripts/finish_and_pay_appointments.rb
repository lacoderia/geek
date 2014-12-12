#!/usr/bin/env ruby
require_relative "../config/environment"

include Clockwork

# a ser ejecutado cada 30 min
every(30.minutes, 'finish_and_pay_appointments', :at => ['**:30', '**:00']) {

  # Marcar como completadas las clases que ya acabaron

  confirmed_appointment = AppointmentStatus.find_by_code("3")
  completed_appointment = AppointmentStatus.find_by_code("6")
  valid_anomaly = RegisteredAnomalyStatus.find_by_code("1")

  Appointment.where("appointments.appointment_status_id = ? AND appointments.end > ?", confirmed_appointment.id, Time.now).each do |appointment|
    appointment.update_attribute(:appointment_status_id, completed_appointment.id) 
  end

  # Cobrar y pagar las clases sin anomalías, y pagar las que tengan anomalías resueltas
  Appointment.where("appointments.appointment_status_id = ? AND appointments.charged = ? AND appointments.paid = ? AND appointments.end > ?", completed_appointment.id, false, false, Time.now - 12.hour).each do |appointment|
    if not appointment.anomaly
      # pagar el appointment
        appointment.update_attribute(:charged, true)
        appointment.update_attribute(:paid, true)
    else
      # revisar si ya está resuelta la anomalía, itera sobre las registradas y busca una con RegisteredAnomalyStatus valida
      appointment.registered_anomalies.each do |ra|
        if ra.registered_anomaly_status == valid_anomaly
          # pagar el appointment
          if ra.fee_student and ra.fee_tutor and ra.fee_student > 0 and ra.fee_tutor > 0
            appointment.update_attribute(:charged, true)
            appointment.update_attribute(:paid, true)
          end
        end
      end
    end
    
  end

}
