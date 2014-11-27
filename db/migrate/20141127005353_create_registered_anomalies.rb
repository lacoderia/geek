class CreateRegisteredAnomalies < ActiveRecord::Migration
  def change
    create_table :registered_anomalies do |t|
      t.integer :anomaly_id
      t.integer :user_id
      t.integer :source_id
      t.integer :appointment_id
      t.string :description
      t.integer :registered_anomaly_status_id
      t.float :fee_student
      t.float :fee_tutor

      t.timestamps
    end
  end
end
