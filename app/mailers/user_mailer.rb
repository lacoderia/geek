class UserMailer < ActionMailer::Base
  default from: "\"Geek Education\" <info@geek.education>"

  def tutor_notification_email tutor_id, status_id, subject
   
    @subject = subject
    @user = Tutor.find(tutor_id)
    @status = AppointmentStatus.find(status_id)
    mail(to: @user.email, subject: "GEEK - actualización de clase - #{@subject}") 

  end

  def student_notification_email student_id, status_id, subject
    
    @subject = subject
    @user = Student.find(student_id) 
    @status = AppointmentStatus.find(status_id)
    mail(to: @user.email, subject: "GEEK - actualización de clase - #{@subject}") 
    
  end

  def test_email text
    mail(to: "tonklis@gmail.com", subject: text)
  end

  #estudiantes
  def student_welcome student
    @student = student
    mail(to: @student.email, subject: "¡Bienvenido!") 
  end

  def student_new_message message
    @student = message.student
    @tutor = message.tutor
    mail(to: @student.email, subject: "Tienes un nuevo mensaje")
  end

  def student_appointment_request_accepted appointment
    @appointment = appointment
    @student = @appointment.student
    @tutor = @appointment.tutor
    mail(to: @student.email, subject: "Solicitud de clase aceptada")
  end

  def student_appointment_request_rejected appointment
    @student = appointment.student
    @tutor = appointment.tutor
    mail(to: @student.email, subject: "Solicitud de clase rechazada")
  end

  def student_evaluate_tutor appointment
    @student = appointment.student
    @tutor = appointment.tutor
    mail(to: @student.email, subject: "Evalúa a tu tutor")
  end

  def student_evaluate_reminder appointment
    @student = appointment.student
    @tutor = appointment.tutor
    mail(to: @student.email, subject: "Recordatorio para evaluar a tu tutor")
  end

  def student_appointment_canceled appointment
    @appointment = appointment
    @student = appointment.student
    @tutor = appointment.tutor
    mail(to: @student.email, subject: "Clase cancelada")
  end

  def student_appointment_reminder appointments
    @appointments = appointments
    @student = appointments[0].student
    mail(to: @student.email, subject: "Recordatorio de clases")
  end

  def student_appointment_charged appointment
    @appointment = appointment
    @student = appointment.student
    @tutor = appointment.tutor
    mail(to: @student.email, subject: "Notificación de cobro")
  end

  #tutores

  def tutor_welcome tutor
    @tutor = tutor
    mail(to: @tutor.email, subject: "¡Bienvenido!") 
  end

  def tutor_new_message message
    @student = message.student
    @tutor = message.tutor
    mail(to: @tutor.email, subject: "Tienes un nuevo mensaje")
  end

  def tutor_new_appointment_request appointment
    @student = appointment.student
    @tutor = appointment.tutor
    mail(to: @tutor.email, subject: "Tienes una nueva solicitud de clase")
  end 

  def tutor_pending_appointment_request tutor
    @tutor = tutor
    mail(to: @tutor.email, subject: "Tienes solicitudes de clase pendientes")
  end

  def tutor_appointment_confirmed appointment
    @student = appointment.student
    @tutor = appointment.tutor
    mail(to: @tutor.email, subject: "Confirmación de clase registrada")
  end

  def tutor_appointment_canceled appointment
    @appointment = appointment
    @student = appointment.student
    @tutor = appointment.tutor
    mail(to: @tutor.email, subject: "Clase cancelada")
  end
  
  def tutor_appointment_reminder appointments
    @appointments = appointments
    @tutor = appointments[0].tutor
    mail(to: @tutor.email, subject: "Recordatorio de clases")
  end

end
