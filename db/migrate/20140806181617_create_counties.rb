class CreateCounties < ActiveRecord::Migration
  def change
    create_table :counties do |t|
      t.string :name
      t.integer :postal_code_id

      t.timestamps
    end
  end
end
