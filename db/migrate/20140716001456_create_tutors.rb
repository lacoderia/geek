class CreateTutors < ActiveRecord::Migration
  def change
    create_table :tutors do |t|
      t.text :details
      t.text :references
      t.text :background
      t.integer :preference_id
      t.integer :bank_account_id
      t.string :calendar_id

      t.timestamps
    end
  end
end
