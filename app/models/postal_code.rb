class PostalCode < ActiveRecord::Base
	belongs_to :city
	belongs_to :state
	has_many :counties
end
