class AddRemoveColumnsToReviews < ActiveRecord::Migration
  def change
  	remove_column :reviews, :grade
  	add_column :reviews, :grade_knowledge, :float
  	add_column :reviews, :grade_communication, :float
  	add_column :reviews, :grade_presentation, :float
  end
end
