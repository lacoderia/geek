class AddFieldsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :gender, :string
    add_column :users, :picture_url, :string
    add_column :users, :phone_number, :string
    add_column :users, :client_id, :integer
    add_column :users, :client_type, :string
  end
end
