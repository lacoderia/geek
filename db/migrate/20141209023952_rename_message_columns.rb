class RenameMessageColumns < ActiveRecord::Migration
  def change
  	rename_column :messages, :sender_id, :student_id
  	rename_column :messages, :recipient_id, :tutor_id
  end
end
