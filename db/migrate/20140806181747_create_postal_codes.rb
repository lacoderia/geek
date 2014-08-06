class CreatePostalCodes < ActiveRecord::Migration
  def change
    create_table :postal_codes do |t|
      t.string :code
      t.integer :state_id
      t.integer :city_id

      t.timestamps
    end
  end
end
