class CreateBankAccounts < ActiveRecord::Migration
  def change
    create_table :bank_accounts do |t|
      t.string :openpay_id
      t.string :alias
      t.string :holder_name
      t.string :clabe
      t.string :bank_name
      t.string :bank_code
      t.datetime :creation_date

      t.timestamps
    end
  end
end
