class UserMailer < ActionMailer::Base
  default from: "benjamin.hernandez@in2teck.com"

  def tutor_notification_email tutor_id, status_id
    
    @user = Tutor.find(tutor_id)
    @status = AppointmentStatus.find(status_id)
    mail(to: @user.email, subject: "GEEK - actualización de clase.") 

  end

  def student_notification_email student_id, status_id
    
    @user = Student.find(student_id) 
    @status = AppointmentStatus.find(status_id)
    mail(to: @user.email, subject: "GEEK - actualización de clase.") 
    
  end

end
