json.balance @balance
if @card
	json.set! :card do
	json.extract! @card, :id, :alias, :active, :is_bank_account
		if @card.is_bank_account
	  	json.extract! @openpay_card, "bank_name", "holder_name"
	  	json.card_number @openpay_card["clabe"][14,17]
	  else
	  	json.extract! @openpay_card, "brand", "holder_name", "expiration_month", "expiration_year"
	  	json.card_number @openpay_card["card_number"][12,15]
	  end
	end
else
	json.card nil
end