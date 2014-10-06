class CreateVacations < ActiveRecord::Migration
  def change
    create_table :vacations do |t|
      t.datetime :start
      t.datetime :end
      t.integer :tutor_id

      t.timestamps
    end
  end
end
