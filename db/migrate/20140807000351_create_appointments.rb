class CreateAppointments < ActiveRecord::Migration
  def change
    create_table :appointments do |t|
      t.integer :appointment_status_id
      t.integer :student_id
      t.integer :tutor_id
      t.datetime :start
			t.datetime :end
      t.text :details
      t.integer :address_id

      t.timestamps
    end
  end
end
