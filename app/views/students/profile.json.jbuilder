if @student
	json.extract! @student, :id, :first_name, :last_name, :email, :gender, :phone_number
end