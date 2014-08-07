json.array!(@reviews) do |review|
  json.extract! review, :id, :student_id, :tutor_id, :grade, :description
  json.url review_url(review, format: :json)
end
