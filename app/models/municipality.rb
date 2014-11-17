class Municipality < ActiveRecord::Base
  has_many :postal_codes
end
