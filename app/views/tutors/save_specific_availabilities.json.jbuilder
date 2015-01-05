json.array! (@specific_availabilities) do |availability|
  json.extract! availability, :id, :tutor_id, :start, :end
end
