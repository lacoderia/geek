class CreateCards < ActiveRecord::Migration
  def change
    create_table :cards do |t|
      t.string :openpay_id
      t.string :alias
      t.integer :user_id
      t.boolean :active

      t.timestamps
    end
  end
end
