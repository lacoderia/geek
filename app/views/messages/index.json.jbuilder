json.array!(@messages) do |message|
  json.extract! message, :id, :sender_id, :recipient_id, :text, :status
  json.url message_url(message, format: :json)
end
