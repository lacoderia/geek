class AddMunicipalityIdToPostalCodes < ActiveRecord::Migration
  def change
    add_column :postal_codes, :municipality_id, :integer
  end
end
