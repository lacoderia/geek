#!/usr/bin/env ruby
require_relative "../config/environment"

include Clockwork

# Completar, rechazar y pagar citas
every(5.minutes, 'complete_and_reject_and_pay_appointments', :at => ['**:15', '**:00']) {

  pending_appointment = AppointmentStatus.find_by_code("0")
  confirmed_appointment = AppointmentStatus.find_by_code("3")
  completed_appointment = AppointmentStatus.find_by_code("6")
  rejected_by_tutor = AppointmentStatus.find_by_code("2")
  valid_anomaly = RegisteredAnomalyStatus.find_by_code("1")

  # Marcar como completadas las clases que ya acabaron
  Appointment.where("appointments.appointment_status_id = ? AND appointments.end < ?", confirmed_appointment.id, Time.now).each do |appointment|
    student = appointment.student
    mail_sent = false
    tutor_evaluated = false
    Tutor.by_student(student).each do |tutor|
      if tutor.id == appointment.tutor_id
        tutor.reviews.each do |review|
          tutor_evaluated = true if review.student_id == student.id
        end
        if !tutor_evaluated
          UserMailer.student_evaluate_reminder(appointment).deliver 
          mail_sent = true
        end
      end
    end
    UserMailer.student_evaluate_tutor(appointment).deliver unless mail_sent || tutor_evaluated
    appointment.update_attribute(:appointment_status_id, completed_appointment.id)
  end
  
  # Rechazar appointments pendientes
  Appointment.where("appointments.appointment_status_id = ?", pending_appointment.id).each do |appointment|

    diff = ((appointment.start-appointment.created_at)/1.hour)
    update = false

    #creadas con más de dos horas de anticipación
    if diff > Appointment.hours_after_business_rules_max #2
      
      #si no confirma antes de las 2 horas, se rechaza
      if appointment.start < Time.now + Appointment.hours_after_business_rules_max.hour #2
        update = true
      end
    else
    
      #si no confirma antes de la cita, se rechaza
      if appointment.start < Time.now
        update = true
      end      
    end

    if update
      appointment.update_attribute(:appointment_status_id, rejected_by_tutor.id)
      appointment.appointment_updated rejected_by_tutor 
    end
    
  end

  # Cobrar y pagar las clases sin anomalías, y pagar las que tengan anomalías resueltas
  Appointment.where("appointments.appointment_status_id = ? AND appointments.charged = ? AND appointments.paid = ? AND appointments.end < ?", completed_appointment.id, false, false, Time.now - Appointment.hours_after_business_rules.hour).each do |appointment|

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
  students = {}
  tutors_reminders = {}
  tutors_requests = {}
  Appointment.where("appointments.start BETWEEN ? AND ? AND (appointments.appointment_status_id = ? OR appointments.appointment_status_id = ?)", DateTime.now.tomorrow.beginning_of_day, DateTime.now.tomorrow.end_of_day, AppointmentStatus.find_by_code("0"), AppointmentStatus.find_by_code("3")).order("start ASC").includes(:tutor, :student, :appointment_status).each do |appointment|
    students[appointment.student.id] = [] if students[appointment.student.id].nil?
    students[appointment.student.id].push(appointment) if appointment.appointment_status.code == "3"
    tutors_reminders[appointment.tutor.id] = [] if tutors_reminders[appointment.tutor.id].nil?
    tutors_reminders[appointment.tutor.id].push(appointment) if appointment.appointment_status.code == "3"
    tutors_requests[appointment.tutor.id] = appointment.tutor if appointment.appointment_status.code == "0"
  end
  students.each do |key, value|
    UserMailer.student_appointment_reminder(value).deliver
  end
  tutors_reminders.each do |key, value|
    UserMailer.tutor_appointment_reminder(value).deliver
  end
  tutors_requests.each do |key, value|
    UserMailer.tutor_pending_appointment_request(value).deliver
  end
}
