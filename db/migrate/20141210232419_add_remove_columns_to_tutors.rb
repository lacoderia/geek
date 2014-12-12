class AddRemoveColumnsToTutors < ActiveRecord::Migration
  def change
  	remove_column :tutors, :tier1_rate
  	remove_column :tutors, :tier2_rate
  	remove_column :tutors, :tier3_rate
  	add_column :tutors, :grade, :float
  end
end
