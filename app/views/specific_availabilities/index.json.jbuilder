json.array!(@specific_availabilities) do |specific_availability|
  json.extract! specific_availability, :id, :tutor_id, :start, :end
  json.url specific_availability_url(specific_availability, format: :json)
end
