class AddAppointmentIdToAppointments < ActiveRecord::Migration
  def change
    add_column :appointments, :appointment_id, :string
  end
end
