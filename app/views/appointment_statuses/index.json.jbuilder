json.array!(@appointment_statuses) do |appointment_status|
  json.extract! appointment_status, :id, :name
  json.url appointment_status_url(appointment_status, format: :json)
end
