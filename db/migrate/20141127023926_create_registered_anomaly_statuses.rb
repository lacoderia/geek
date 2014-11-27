class CreateRegisteredAnomalyStatuses < ActiveRecord::Migration
  def change
    create_table :registered_anomaly_statuses do |t|
      t.string :name
      t.string :code

      t.timestamps
    end
  end
end
