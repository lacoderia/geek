if @grouped

  json.array! (@appointments) do |key, value|
    json.set! key do
      json.array!(value) do |appointment|
        json.extract! appointment, :id, :start, :end, :details, :subject
        json.set! :student do 
          json.extract! appointment.student, :id, :first_name, :last_name
        end
        json.set! :address do
          json.extract! appointment.address, :id, :description, :line1, :line2 if appointment.address
        end
        json.set! :status do
          json.extract! appointment.appointment_status, :id, :name
        end
      end
    end
  end

else

  json.array!(@appointments) do |appointment|
    json.extract! appointment, :id, :start, :end, :details, :subject
    json.set! :student do 
      json.extract! appointment.student, :id, :first_name, :last_name
    end
    json.set! :address do
      json.extract! appointment.address, :id, :description, :line1, :line2 if appointment.address
    end
    json.set! :status do
      json.extract! appointment.appointment_status, :id, :name
    end
  end

end
