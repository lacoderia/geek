json.array!(@appointments) do |appointment|
  json.extract! appointment, :id, :start, :end, :details, :subject
  json.set! :student do 
		json.extract! appointment.student, :id, :first_name, :last_name
	end
	json.set! :address do
		json.extract! appointment.address, :id, :description, :line1, :line2
	end
	json.set! :status do
		json.extract! appointment.appointment_status, :id, :name
	end
end
