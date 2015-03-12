if @student
	json.extract! @student, :id, :first_name, :last_name, :email, :phone_number, :picture_url, :active
	has_card = false
	@student.cards.each do |card|
		has_card = true if card.active
	end
	json.has_card has_card
end
if @remember
	json.remember_tutor @remember
end
