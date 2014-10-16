json.array!(@appointments) do |appointment|
  json.extract! appointment, :id, :start, :end, :details
  json.set! :tutor do 
		json.extract! appointment.tutor, :id, :first_name, :last_name
	end
	json.set! :address do
		json.extract! appointment.address, :id, :description, :line1, :line2
	end
	json.set! :status do
		json.extract! appoinment.appointment_status, :id, :name
	end
end
