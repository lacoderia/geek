json.array!(@appointment_statuses) do |appointment_status|
  json.extract! appointment_status, :id, :name, :code
end
