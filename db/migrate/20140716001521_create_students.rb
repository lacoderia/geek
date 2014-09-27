class CreateStudents < ActiveRecord::Migration
  def change
    create_table :students do |t|
      t.float :credits

      t.timestamps
    end
  end
end
