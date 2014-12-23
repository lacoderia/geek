json.array!(@cards) do |card|
  json.extract! card, :id, :openpay_id, :alias, :active
end
