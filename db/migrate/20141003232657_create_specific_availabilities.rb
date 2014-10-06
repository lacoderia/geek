class CreateSpecificAvailabilities < ActiveRecord::Migration
  def change
    create_table :specific_availabilities do |t|
      t.integer :tutor_id
      t.datetime :start
      t.datetime :end

      t.timestamps
    end
  end
end
