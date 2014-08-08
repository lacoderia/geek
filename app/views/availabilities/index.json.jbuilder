json.array!(@availabilities) do |availability|
  json.extract! availability, :id, :start, :end, :tutor_id
  json.url availability_url(availability, format: :json)
end
