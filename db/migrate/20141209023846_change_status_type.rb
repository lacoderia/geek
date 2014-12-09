class ChangeStatusType < ActiveRecord::Migration
  def change
  	remove_column :messages, :status
  	add_column :messages, :read, :boolean, :default => false
  end
end
