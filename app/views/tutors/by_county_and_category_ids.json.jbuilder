json.array!(@tutors) do |tutor|
  json.extract! tutor, :id, :first_name, :last_name, :details, :references, :background, :calendar_id, :picture_url, :email
  json.set! :counties do
    json.array! (tutor.counties) do |county|
      json.extract! county, :id, :postal_code_id, :name
    end
  end
  json.set! :categories do
    json.array! (tutor.categories_tutors) do |ct|
      category = ct.category 
      json.id category.id
      json.name category.name
      json.category_id category.category_id
      json.picture_url category.picture_url
      json.cost ct.cost
    end
  end
  json.set! :preference do
    json.extract! (tutor.preference), :id, :online, :office, :cost
  end
  json.set! :reviews do
    counter = 0
    sum = 0.0
    tutor.reviews.each do |review|
      sum += review.grade
      counter += 1
    end
    json.average (sum/counter) if counter > 0
  end
  json.set! :appointments do
    class_counter = 0
    student_counter = []
    tutor.appointments.each do |appointment|
      if appointment.end < Time.now
        class_counter += 1
        student_counter << appointment.student_id
      end
    end
    json.classes class_counter if class_counter > 0 
    json.students student_counter.uniq.count if student_counter.count > 0
  end
end
