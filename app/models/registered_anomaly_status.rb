class RegisteredAnomalyStatus < ActiveRecord::Base
  has_many :registered_anomalies
end
