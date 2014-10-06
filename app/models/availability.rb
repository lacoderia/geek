class Availability < ActiveRecord::Base
	belongs_to :week_day
	belongs_to :preference
end
