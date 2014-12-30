class AddIsBankAccountToCards < ActiveRecord::Migration
  def change
  	add_column :cards, :is_bank_account, :boolean, :default => false
  end
end
