json.array!(@preferences) do |preference|
  json.extract! preference, :id, :cost, :online, :office
  json.url preference_url(preference, format: :json)
end
