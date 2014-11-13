json.array!(@tutors) do |tutor|
  json.extract! tutor, :id, :first_name, :last_name, :details, :references, :background, :calendar_id, :picture_url
  json.set! :counties do
    json.array! (tutor.counties) do |county|
      json.extract! county, :id, :postal_code_id, :name
    end
  end
  json.set! :categories do
    json.array! (tutor.categories_tutors) do |ct|
      category = Category.find(ct.category_id)
      json.id category.id
      json.name category.name
      json.category_id category.category_id
      json.picture_url category.picture_url
      json.cost ct.cost
    end
  end
  json.set! :preference do
    json.extract! (tutor.preference), :id, :online, :office, :cost
  end
  json.set! :bank_account do
    json.extract! (tutor.bank_account), :id, :openpay_id, :alias, :holder_name, :clabe, :bank_name, :bank_code if tutor.bank_account
  end
end
