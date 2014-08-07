class JoinAddressesUsers < ActiveRecord::Migration
  def up
	  create_table :addresses_users, :id => false do |t|
		  t.references :address, :user
  	end
  end

  def down
	  drop_table :addresses_users
  end
end
