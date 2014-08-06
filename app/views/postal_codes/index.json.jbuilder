json.array!(@postal_codes) do |postal_code|
  json.extract! postal_code, :id, :code, :state_id, :city_id
  json.url postal_code_url(postal_code, format: :json)
end
