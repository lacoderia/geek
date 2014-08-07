class CreateCategories < ActiveRecord::Migration
  def change
    create_table :categories do |t|
      t.string :name
      t.string :description
      t.integer :category_id
			t.string :picture_url

      t.timestamps
    end
  end
end
