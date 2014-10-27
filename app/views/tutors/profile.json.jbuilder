if @tutor
  json.extract! @tutor, :id, :first_name, :last_name, :email, :gender, :phone_number, :details, :references, :background
  json.set! :preference do
    json.extract! @tutor.preference, :id, :online, :office, :cost if @tutor.preference
    json.set! :availabilities do
      json.array!(@tutor.preference.availabilities) do |availability|
        json.extract! availability, :id
        json.start "#{availability.start.utc.strftime '%H:%M'}"
        json.end "#{availability.end.utc.strftime '%H:%M'}"
        json.day_number WeekDay.find(availability.week_day_id).day_number
      end
    end
  end
      
  json.set! :categories do
    json.array!(@tutor.categories) do |category|
      json.extract! category, :id, :name, :category_id
    end
  end

  json.set! :counties do
    json.array!(@tutor.counties) do |county|
      json.extract! county, :id, :name, :postal_code
    end
  end
  
end
