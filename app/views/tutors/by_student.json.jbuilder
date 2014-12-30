json.array!(@tutors) do |tutor|
  json.extract! tutor, :id, :first_name, :last_name, :picture_url
  has_evaluation = false
  tutor.reviews.each do |review|
  	has_evaluation = review.student_id == @student.id
  	if has_evaluation
  		json.set! :evaluation do
  			json.extract! review, :description, :grade_knowledge, :grade_communication, :grade_presentation
  			json.timestamp review.created_at
  		end
  	end
  end
  json.has_evaluation has_evaluation
end