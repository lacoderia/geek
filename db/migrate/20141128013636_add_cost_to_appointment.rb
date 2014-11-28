class AddCostToAppointment < ActiveRecord::Migration
  def change
  	add_column :appointments, :cost, :float, :default => 0
  end
end
