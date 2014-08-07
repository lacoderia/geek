class JoinCategoriesTutors < ActiveRecord::Migration
  def up
	  create_table :categories_tutors, :id => false do |t|
		  t.references :category, :tutor
  	end
  end

  def down
	  drop_table :categories_tutors
  end
end
