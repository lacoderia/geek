json.array!(@counties) do |county|
  json.extract! county, :id, :name, :postal_code_id
  json.url county_url(county, format: :json)
end
