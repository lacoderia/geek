class AddPublicToPreferences < ActiveRecord::Migration
  def change
    add_column :preferences, :public, :boolean
  end
end
