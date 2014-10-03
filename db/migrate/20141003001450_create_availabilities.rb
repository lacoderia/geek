class CreateAvailabilities < ActiveRecord::Migration
  def change
    create_table :availabilities do |t|
      t.integer :week_day_id
      t.integer :preference_id
      t.time :start
      t.time :end

      t.timestamps
    end
  end
end
