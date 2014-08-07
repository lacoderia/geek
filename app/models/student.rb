class Student < ActiveRecord::Base
  
  acts_as :user, :as => :client
	has_many :reviews
	has_and_belongs_to_many :purchases
	has_many :appointments

end
