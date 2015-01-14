#!/usr/bin/env ruby
require_relative "../config/environment"

include Clockwork

# Completar, rechazar y pagar citas
every(30.minutes, 'complete_and_reject_and_pay_appointments', :at => ['**:30', '**:00']) {

  pending_appointment = AppointmentStatus.find_by_code("0")
  confirmed_appointment = AppointmentStatus.find_by_code("3")
  completed_appointment = AppointmentStatus.find_by_code("6")
  rejected_by_tutor = AppointmentStatus.find_by_code("2")
  valid_anomaly = RegisteredAnomalyStatus.find_by_code("1")

  # Marcar como completadas las clases que ya acabaron
  Appointment.where("appointments.appointment_status_id = ? AND appointments.end < ?", confirmed_appointment.id, Time.now).each do |appointment|
    appointment.update_attribute(:appointment_status_id, completed_appointment.id) 
  end
  
  # Rechazar appointments pendientes
  Appointment.where("appointments.appointment_status_id = ?", pending_appointment.id).each do |appointment|
    diff = ((appointment.start-appointment.created_at)/1.hour)
    update = false
    #creadas con más de 12 horas de anticipación
    if diff > Appointment.hours_before_business_rules #12

      #si no confirma antes de las 12 horas, se rechaza
      if appointment.start < Time.now + Appointment.hours_before_confirming.hour #12
        update = true
      end

    else

      #creadas con más de dos horas de anticipación
      if diff > Appointment.hours_afer_business_rules_max #2

        #si no confirma antes de las 2 horas, se rechaza
        if appointment.start < Time.now + Appointment.hours_afer_business_rules_max.hour #12
          update = true
        end
        
      else
        
        #si no confirma antes de la cita, se rechaza
        if appointment.start < Time.now
          update = true
        end

      end

    end

    if update
      appointment.update_attribute(:appointment_status_id, rejected_by_tutor.id)

      if Rails.env.production?
        UserMailer.tutor_notification_email(appointment.tutor_id, appointment.appointment_status_id, appointment.subject).deliver
        UserMailer.student_notification_email(appointment.student_id, appointment.appointment_status_id, appointment.subject).deliver
      end
    end
    
  end

  # Cobrar y pagar las clases sin anomalías, y pagar las que tengan anomalías resueltas
  Appointment.where("appointments.appointment_status_id = ? AND appointments.charged = ? AND appointments.paid = ? AND appointments.end < ?", completed_appointment.id, false, false, Time.now - Appointment.hours_afer_business_rules.hour).each do |appointment|

    #si no tiene anomalias ni log de errores
    if not appointment.anomaly and not appointment.log
      # pagar el appointment
      appointment.pay 100, 80
    end

  end

}

# Revisar si es 15 de cada mes y hacer retiro automático (cashout tutor)
every(1.day, 'tutor_cashout', :if => lambda { |t| t.day == 15}) {

  Tutor.where("active = ?", true).each do |tutor|
    tutor.cash_out
  end
}
  
# Cada noche mandar a estudiante, informando de clases del próximo día
# Cada noche mandar a tutor, informando de clases del próximo día y de solicitudes pendientes
every(1.day, 'send_notifications', :at => '19:00') {
  Appointment.where("appointments.start BETWEEN ? AND ?", DateTime.now.tomorrow.beginning_of_day, DateTime.now.tomorrow.end_of_day).each do |appointment|
    #TODO: Diego a incluir las notificaciones
  end
}
