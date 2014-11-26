if @tutor
  json.extract! @tutor, :id, :first_name, :last_name, :email, :gender, :phone_number, :details, :references, :background, :picture_url
  json.set! :preference do
    json.extract! @tutor.preference, :id, :online, :office, :public, :student_place, :cost if @tutor.preference
    json.set! :availabilities do
      json.array!(@tutor.preference.availabilities) do |availability|
        json.extract! availability, :id
        json.start "#{availability.start.strftime '%H:%M'}"
        json.end "#{availability.end.strftime '%H:%M'}"
        json.day_number WeekDay.find(availability.week_day_id).day_number
      end
    end
  end
      
  json.set! :categories do
    json.array!(@tutor.categories_tutors) do |ct|
      category = Category.find(ct.category_id)
      json.id category.id
      json.name category.name
      json.category_id category.category_id
      json.cost ct.cost
    end
  end

  json.set! :counties do
    json.array!(@tutor.counties) do |county|
      json.extract! county, :id, :name, :postal_code
    end
  end
  
end
