class AddRatingToTutors < ActiveRecord::Migration
  def change
  	add_column :tutors, :rating, :float
    add_index :tutors, :rating
  end
end
