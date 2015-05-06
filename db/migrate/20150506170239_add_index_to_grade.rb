class AddIndexToGrade < ActiveRecord::Migration
  def change
  	add_index :tutors, :grade
  end
end
