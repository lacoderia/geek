class Tutor < ActiveRecord::Base
  
  acts_as :user, :as => :client
	belongs_to :preference	
	belongs_to :bank_account
	has_many :availabilities
	has_many :reviews
	has_and_belongs_to_many :counties
	has_and_belongs_to_many :categories
	has_many :appointments

end
