json.array!(@registered_anomalies) do |registered_anomaly|
  json.extract! registered_anomaly, :id, :anomaly_id, :user_id, :appointment_id
  json.url registered_anomaly_url(registered_anomaly, format: :json)
end
