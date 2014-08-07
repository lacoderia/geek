class JoinPurchasesStudents < ActiveRecord::Migration
  def up
	  create_table :purchases_students, :id => false do |t|
		  t.references :purchase, :student
  	end
  end

  def down
	  drop_table :purchases_students
  end
end
