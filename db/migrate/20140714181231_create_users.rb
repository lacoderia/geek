class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :uid
      t.string :first_name
      t.string :last_name
      t.boolean :active
      t.string :openpay_id
			t.string :token

      t.timestamps
    end
  end
end
