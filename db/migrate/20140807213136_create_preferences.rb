class CreatePreferences < ActiveRecord::Migration
  def change
    create_table :preferences do |t|
      t.boolean :online
      t.boolean :office
      t.float :cost

      t.timestamps
    end
  end
end
