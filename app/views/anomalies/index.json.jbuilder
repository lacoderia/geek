json.array!(@anomalies) do |anomaly|
  json.extract! anomaly, :id, :name
  json.url anomaly_url(anomaly, format: :json)
end
