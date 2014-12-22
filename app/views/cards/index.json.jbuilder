json.array!(@cards) do |card|
  json.extract! card, :id, :openpay_id, :token_id, :alias, :student_id, :active
end
