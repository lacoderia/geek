json.array!(@students) do |student|
  json.extract! student, :id, :credits, :openpay_id
  json.url student_url(student, format: :json)
end
