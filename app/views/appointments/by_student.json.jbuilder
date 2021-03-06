if @grouped

  json.array! (@appointments) do |key, value|
    json.set! key do
      json.array!(value) do |appointment|
        json.extract! appointment, :id, :start, :end, :details, :subject, :charged, :paid
        json.set! :tutor do 
          json.extract! appointment.tutor, :id, :first_name, :last_name
        end
        json.set! :address do
          json.extract! appointment.address, :id, :description, :line1, :line2 if appointment.address
        end
        json.set! :status do
          json.extract! appointment.appointment_status, :id, :name, :code
        end
        if appointment.anomaly 
          appointment.registered_anomalies.each do |anomaly|
            if anomaly.source_id == appointment.student.user.id
              json.set! :anomaly do
                json.extract! anomaly, :id, :appointment_id, :description
                json.anomaly anomaly.anomaly.code
                json.anomaly_status anomaly.registered_anomaly_status.code
              end
            end
          end
        end
      end
    end
  end

else

  json.array!(@appointments) do |appointment|
    json.extract! appointment, :id, :start, :end, :details, :subject, :charged, :paid
    json.set! :tutor do 
      json.extract! appointment.tutor, :id, :first_name, :last_name
    end
    json.set! :address do
      json.extract! appointment.address, :id, :description, :line1, :line2 if appointment.address
    end
    json.set! :status do
      json.extract! appointment.appointment_status, :id, :name, :code
    end
    if appointment.anomaly
      appointment.registered_anomalies.each do |anomaly|
        if anomaly.source_id == appointment.student.user.id
          json.set! :anomaly do
            json.extract! anomaly, :id, :appointment_id, :description
            json.anomaly anomaly.anomaly.code
            json.anomaly_status anomaly.registered_anomaly_status.code
          end
        end
      end
    end
  end
end
