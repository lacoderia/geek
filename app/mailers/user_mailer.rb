class UserMailer < ActionMailer::Base
  default from: "benjamin.hernandez@in2teck.com"

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

end
