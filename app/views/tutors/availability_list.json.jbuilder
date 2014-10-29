json.array! (@availability_list) do |availability|
  json.extract! availability, :day, :start, :end
end
