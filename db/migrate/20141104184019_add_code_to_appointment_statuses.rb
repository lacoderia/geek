class AddCodeToAppointmentStatuses < ActiveRecord::Migration
  def change
    add_column :appointment_statuses, :code, :string
  end
end
