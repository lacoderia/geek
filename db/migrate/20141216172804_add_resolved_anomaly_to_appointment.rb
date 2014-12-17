class AddResolvedAnomalyToAppointment < ActiveRecord::Migration
  def change
    add_column :appointments, :resolved_anomaly, :boolean, :default => false
  end
end
