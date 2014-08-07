json.array!(@bank_accounts) do |bank_account|
  json.extract! bank_account, :id, :openpay_id, :alias, :holder_name, :clabe, :bank_name, :bank_code, :creation_date
  json.url bank_account_url(bank_account, format: :json)
end
