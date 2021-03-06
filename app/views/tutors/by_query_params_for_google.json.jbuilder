@tutors = @result_obj[:tutors][:items] if @result_obj[:tutors]
@suggested_tutors = @result_obj[:suggested_tutors][:items] if @result_obj[:suggested_tutors]
@message = @result_obj[:message]

json.message @message 

json.set! :tutors do
  
  if @tutors
    json.count @result_obj[:tutors][:count]
  else
    json.count 0
  end

  json.set! :items do

    json.array!(@tutors) do |tutor|
      json.extract! tutor, :id, :first_name, :last_name, :details, :references, :background, :picture_url, :email
      json.set! :counties do
        json.array! (tutor.counties) do |county|
          json.extract! county, :id, :postal_code_id, :name
        end
      end
      json.set! :categories do
        json.array! (tutor.categories) do |category|
          json.id category.id
          json.name category.name
          json.category_id category.category_id
          json.picture_url category.picture_url
          json.cost category.categories_tutors.select{|ct| ct.tutor_id == tutor.id}.first.cost
        end 
      end
      json.set! :preference do
        json.extract! (tutor.preference), :id, :online, :office, :public, :student_place
      end
      json.set! :reviews do
        json.set! :comments do
          json.array!(tutor.reviews) do |review|
            if review.visible
              json.description review.description
              json.timestamp review.created_at
              json.set! :student do
                json.first_name review.student.first_name
                json.last_name review.student.last_name
                json.picture_url review.student.picture_url
              end
            end
          end
        end
        json.average tutor.grade
      end
      json.set! :appointments do
        class_counter = 0
        student_counter = []
        completed_appointment = AppointmentStatus.find_by_code("6")

        tutor.appointments.each do |appointment|
          if appointment.appointment_status_id == completed_appointment.id
            class_counter += 1
            student_counter << appointment.student_id
          end
        end
        json.classes class_counter if class_counter > 0 
        json.students student_counter.uniq.count if student_counter.count > 0
      end
    end

  end

end

json.set! :suggested_tutors do
  
  if @suggested_tutors
    json.count @result_obj[:suggested_tutors][:count]
  else
    json.count 0
  end

  json.set! :items do

    json.array!(@suggested_tutors) do |tutor|
      json.extract! tutor, :id, :first_name, :last_name, :details, :references, :background, :picture_url, :email
      json.set! :counties do
        json.array! (tutor.counties) do |county|
          json.extract! county, :id, :postal_code_id, :name
        end
      end 
      json.set! :categories do
        json.array! (tutor.categories) do |category|
          json.id category.id
          json.name category.name
          json.category_id category.category_id
          json.picture_url category.picture_url
          json.cost category.categories_tutors.select{|ct| ct.tutor_id == tutor.id}.first.cost
        end
      end
      json.set! :preference do
        json.extract! (tutor.preference), :id, :online, :office, :public, :student_place
      end
      json.set! :reviews do
        json.set! :comments do
          json.array!(tutor.reviews) do |review|
            if review.visible
              json.description review.description
              json.timestamp review.created_at
              json.set! :student do
                json.first_name review.student.first_name
                json.last_name review.student.last_name
                json.picture_url review.student.picture_url
              end
            end
          end
        end
        json.average tutor.grade
      end
      json.set! :appointments do
        class_counter = 0
        student_counter = []
        completed_appointment = AppointmentStatus.find_by_code("6")

        tutor.appointments.each do |appointment|
          if appointment.appointment_status_id == completed_appointment.id
            class_counter += 1
            student_counter << appointment.student_id
          end
        end
        json.classes class_counter if class_counter > 0 
        json.students student_counter.uniq.count if student_counter.count > 0
      end
    end

  end

end
