json.array!(@week_days) do |week_day|
  json.extract! week_day, :id, :day, :day_number
  json.url week_day_url(week_day, format: :json)
end
