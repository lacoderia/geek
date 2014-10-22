if @tutor
	json.extract! @tutor, :id, :first_name, :last_name, :email, :gender, :phone_number, :details, :references, :background
	json.set! :preference do 
		json.extract! @tutor.preference, :online, :office, :cost if @tutor.preference
	end
	json.set! :categories do
		json.array!(@tutor.categories) do |category|
			json.extract! category, :id, :name, :category_id
		end
	end
	json.set! :counties do
		json.array!(@tutor.counties) do |county|
			json.extract! county, :id, :name, :postal_code
		end
	end
end