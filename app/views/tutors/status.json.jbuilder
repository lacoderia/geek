if @tutor
	json.extract! @tutor, :id, :approved, :first_name, :last_name
	json.request_sent  @tutor.background != nil ? true : false
end