json.array!(@zones) do |zone|
  json.id zone[:id]
  json.name zone[:name]
  json.type zone[:type]
end
