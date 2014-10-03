class Preference < ActiveRecord::Base
	has_one :tutor
	has_many :availabilities
	has_many :week_days, through: :availabilities
end
