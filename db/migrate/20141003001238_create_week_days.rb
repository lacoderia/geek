class CreateWeekDays < ActiveRecord::Migration
  def change
    create_table :week_days do |t|
      t.string :day

      t.timestamps
    end
  end
end
