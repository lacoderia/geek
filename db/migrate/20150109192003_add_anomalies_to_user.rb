class AddAnomaliesToUser < ActiveRecord::Migration
  def change
    add_column :users, :cancellations, :integer, :default => 0
    add_column :users, :late_shows, :integer, :default => 0
    add_column :users, :no_shows, :integer, :default => 0
  end
end
