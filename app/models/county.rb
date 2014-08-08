class County < ActiveRecord::Base
	belongs_to :postal_code
	has_many :addresses
	has_and_belongs_to_many :tutors
end
