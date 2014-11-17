class PostalCode < ActiveRecord::Base
	belongs_to :city
	belongs_to :state
	has_many :counties
        belongs_to :municipality
end
