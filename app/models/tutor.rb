class Tutor < ActiveRecord::Base
  
  acts_as :user, :as => :client

end
