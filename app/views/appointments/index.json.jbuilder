json.array!(@appointments) do |appointment|
  json.extract! appointment, :id, :appointment_status_id, :student_id, :tutor_id, :date, :details, :address_id
  json.url appointment_url(appointment, format: :json)
end
