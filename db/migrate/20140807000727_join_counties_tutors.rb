class JoinCountiesTutors < ActiveRecord::Migration
  def up
	  create_table :counties_tutors, :id => false do |t|
		  t.references :county, :tutor
  	end
  end

  def down
	  drop_table :counties_tutors
  end
end
