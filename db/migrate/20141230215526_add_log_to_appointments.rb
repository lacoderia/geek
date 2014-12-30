class AddLogToAppointments < ActiveRecord::Migration
  def change
    add_column :appointments, :log, :text
  end
end
