class CreatePreferences < ActiveRecord::Migration
  def change
    create_table :preferences do |t|
      t.time :monday_start
      t.time :monday_end
      t.time :tuesday_start
      t.time :tuesday_end
      t.time :wednesday_start
      t.time :wednesday_end
      t.time :thursday_start
      t.time :thursday_end
      t.time :friday_start
      t.time :friday_end
      t.time :saturday_start
      t.time :saturday_end
      t.time :sunday_start
      t.time :sunday_end
      t.boolean :online
      t.boolean :only_office

      t.timestamps
    end
  end
end
