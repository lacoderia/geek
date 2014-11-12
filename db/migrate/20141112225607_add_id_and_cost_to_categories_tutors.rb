class AddIdAndCostToCategoriesTutors < ActiveRecord::Migration
  def change
    add_column :categories_tutors, :id, :primary_key
    add_column :categories_tutors, :cost, :float, :default => 0
  end
end
