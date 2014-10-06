class WeekDay < ActiveRecord::Base
	has_many :availabilities
	has_many :preferences, through: :availabilities
end
