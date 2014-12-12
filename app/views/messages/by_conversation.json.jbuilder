json.array!(@messages) do |message|
  json.extract! message, :id, :text, :read, :from_student, :created_at
end
