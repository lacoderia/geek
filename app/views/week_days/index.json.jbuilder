json.array!(@week_days) do |week_day|
  json.extract! week_day, :id, :day
  json.url week_day_url(week_day, format: :json)
end
