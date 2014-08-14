json.array!(@counties) do |county|
  json.label county.name
  json.id county.id
end
