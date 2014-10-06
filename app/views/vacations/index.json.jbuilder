json.array!(@vacations) do |vacation|
  json.extract! vacation, :id, :start, :end, :tutor_id
  json.url vacation_url(vacation, format: :json)
end
