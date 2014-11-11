class AddPictureIdToUsers < ActiveRecord::Migration
  def change
    add_column :users, :picture_id, :string
  end
end
