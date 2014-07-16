json.array!(@tutors) do |tutor|
  json.extract! tutor, :id, :details, :references, :background, :calendar_preference_id, :bank_account_id
  json.url tutor_url(tutor, format: :json)
end
