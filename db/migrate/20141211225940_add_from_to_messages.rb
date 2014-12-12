class AddFromToMessages < ActiveRecord::Migration
  def change
  	add_column :messages, :from_student, :boolean
  end
end
