class AddBooleansToAppointments < ActiveRecord::Migration
  def change
    add_column :appointments, :charged, :boolean, :default => false
    add_column :appointments, :paid, :boolean, :default => false
    add_column :appointments, :anomaly, :boolean, :default => false
  end
end
