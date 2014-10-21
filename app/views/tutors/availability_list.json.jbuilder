@availability_list.each do |key, value|
  json.set! key do
    json.array! value
  end
end
