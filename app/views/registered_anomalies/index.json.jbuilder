json.array!(@registered_anomalies) do |registered_anomaly|
  json.extract! registered_anomaly, :id, :description, :user_id, :source_id, :appointment_id, :registered_anomaly_status_id, :fee_student, :fee_tutor
  json.url registered_anomaly_url(registered_anomaly, format: :json)
end
