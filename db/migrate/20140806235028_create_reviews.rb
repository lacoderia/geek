class CreateReviews < ActiveRecord::Migration
  def change
    create_table :reviews do |t|
      t.integer :student_id
      t.integer :tutor_id
      t.float :grade
      t.text :description

      t.timestamps
    end
  end
end
