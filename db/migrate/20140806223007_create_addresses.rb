class CreateAddresses < ActiveRecord::Migration
  def change
    create_table :addresses do |t|
      t.string :description
      t.string :line1
      t.string :line2
      t.integer :county_id

      t.timestamps
    end
  end
end
