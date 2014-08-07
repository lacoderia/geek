json.array!(@purchases) do |purchase|
  json.extract! purchase, :id, :openpay_id, :description, :authorization, :transaction_type, :operation_type, :method, :creation_date, :order_id, :status, :amount, :error_message, :customer_id, :currency, :is_card
  json.url purchase_url(purchase, format: :json)
end
