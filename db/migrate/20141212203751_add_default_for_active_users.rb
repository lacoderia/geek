class AddDefaultForActiveUsers < ActiveRecord::Migration
  def change
    change_column_default :users, :active, true 
  end
end
