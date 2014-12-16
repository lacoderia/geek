class AddVisibleToReviews < ActiveRecord::Migration
  def change
  	add_column :reviews, :visible, :boolean, :default => true
  end
end
