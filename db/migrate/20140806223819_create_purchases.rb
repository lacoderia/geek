class CreatePurchases < ActiveRecord::Migration
  def change
    create_table :purchases do |t|
      t.string :openpay_id
      t.string :description
      t.string :authorization
      t.string :transaction_type
      t.string :operation_type
      t.string :method
      t.string :creation_date
      t.string :order_id
      t.string :status
      t.float :amount
      t.string :error_message
      t.string :customer_id
      t.string :currency
      t.boolean :is_card

      t.timestamps
    end
  end
end
