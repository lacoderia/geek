json.array!(@messages) do |message|
  json.extract! message, :id, :text, :read, :from_student, :created_at
  json.set! :student do
  	json.extract! message.student, :id, :first_name, :last_name, :picture_url
  end
  json.set! :tutor do
  	json.extract! message.tutor, :id, :first_name, :last_name, :picture_url
  end
end
