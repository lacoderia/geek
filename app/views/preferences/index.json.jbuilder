json.array!(@preferences) do |preference|
  json.extract! preference, :id, :monday, :tuesday, :wednesday, :thursday, :friday, :saturday, :sunday, :online, :only_office
  json.url preference_url(preference, format: :json)
end
