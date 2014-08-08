class CreateAvailabilities < ActiveRecord::Migration
  def change
    create_table :availabilities do |t|
      t.datetime :start
      t.datetime :end
      t.integer :tutor_id

      t.timestamps
    end
  end
end
