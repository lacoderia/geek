class AddIdAndCostToCategoriesTutors < ActiveRecord::Migration
  def change
    add_column :categories_tutors, :id, :primary_key
    add_column :categories_tutors, :cost, :float
  end
end
