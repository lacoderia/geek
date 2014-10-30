json.array!(@tutors) do |tutor|
  json.extract! tutor, :id, :first_name, :last_name, :details, :references, :background, :calendar_id
  json.set! :counties do
    json.array! (tutor.counties) do |county|
      json.extract! county, :id, :postal_code_id, :name
    end
  end
  json.set! :categories do
    json.array! (tutor.categories) do |category|
      json.extract! category, :id, :name, :description, :category_id, :picture_url
    end
  end
  json.set! :preference do
    json.extract! (tutor.preference), :id, :online, :office, :cost
  end
  json.set! :bank_account do
    json.extract! (tutor.bank_account), :id, :openpay_id, :alias, :holder_name, :clabe, :bank_name, :bank_code if tutor.bank_account
  end
end
