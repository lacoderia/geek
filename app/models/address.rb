class Address < ActiveRecord::Base
	belongs_to :county
	has_many :appointments
	has_and_belongs_to_many :users
end
