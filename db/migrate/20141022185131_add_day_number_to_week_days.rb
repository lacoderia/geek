class AddDayNumberToWeekDays < ActiveRecord::Migration
  def change
    add_column :week_days, :day_number, :integer
  end
end
