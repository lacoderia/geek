json.array!(@messages) do |message|
  json.extract! message, :id, :text, :read, :created_at
end
