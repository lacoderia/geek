json.balance @balance[:balance]
if @balance[:active][:card]
 card = @balance[:active]
	json.set! :card do
	json.extract! card[:card], :id, :alias, :active, :is_bank_account
		if card[:card].is_bank_account
	  	json.extract! card[:openpay_card][:result], "bank_name", "holder_name"
	  	json.card_number card[:openpay_card][:result]["clabe"][14,17]
	  else
	  	json.extract! card[:openpay_card][:result], "brand", "holder_name", "expiration_month", "expiration_year"
	  	json.card_number card[:openpay_card][:result]["card_number"][12,15]
	  end
	end
else
		json.card nil
end