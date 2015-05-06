class RemoveIndexFromTutors < ActiveRecord::Migration
  def change
  	remove_column :tutors, :index
  end
end
