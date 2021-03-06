json.array!(@categories) do |category|
  json.extract! category, :id, :name, :description, :category_id, :picture_url
  json.url category_url(category, format: :json)
end
