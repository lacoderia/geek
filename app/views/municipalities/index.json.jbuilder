json.array!(@municipalities) do |municipality|
  json.extract! municipality, :id, :name
  json.url municipality_url(municipality, format: :json)
end
