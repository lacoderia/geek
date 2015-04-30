class AddIndexToTutors < ActiveRecord::Migration
  def change
    add_column :tutors, :index, :float
  end
end
