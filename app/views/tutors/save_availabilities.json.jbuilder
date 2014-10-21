json.array! (@availabilities) do |availability|
  json.extract! availability, :id, :week_day_id, :preference_id, :start, :end
end
