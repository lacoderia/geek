class City < ActiveRecord::Base
	has_many :postal_codes
end
