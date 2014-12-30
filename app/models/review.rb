class Review < ActiveRecord::Base
	belongs_to :student
	belongs_to :tutor

	def self.by_tutor tutor_id
		reviews = Review.where("tutor_id = ?", tutor_id).includes(:student, :tutor).order(:id)
	end
end
