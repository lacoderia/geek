json.set! :requests do
	json.total @requests[:total]
	json.set! :latest do
		json.array! (@requests[:appointments]) do |request|
			json.extract! request, :id, :start, :end, :subject
			json.set! :tutor do
				json.extract! request.tutor, :id, :first_name, :last_name
			end
		end
	end
end

json.set! :appointments do
	json.total @appointments[:total]
	json.set! :latest do
		json.array! (@appointments[:appointments]) do |appointment|
			json.extract! appointment, :id, :start, :end, :subject
			json.set! :tutor do
				json.extract! appointment.tutor, :id, :first_name, :last_name
			end
		end
	end
end

json.set! :messages do
	json.total @messages.size
	json.set! :latest do
		count = 0
		json.array! (@messages) do |message|
			if (count < 3)
				json.extract! message, :id, :text
				json.timestamp message.created_at
				json.set! :tutor do
					json.extract! message.tutor, :id, :first_name, :last_name
				end
			end
			count = count + 1			
		end
	end
end