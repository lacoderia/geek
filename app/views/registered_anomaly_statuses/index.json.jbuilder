json.array!(@registered_anomaly_statuses) do |registered_anomaly_status|
  json.extract! registered_anomaly_status, :id, :name
  json.url registered_anomaly_status_url(registered_anomaly_status, format: :json)
end
