class AddSubjectToAppointments < ActiveRecord::Migration
  def change
    add_column :appointments, :subject, :string
  end
end
