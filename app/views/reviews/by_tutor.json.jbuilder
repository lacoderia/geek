grade = 0
grade_knowledge = 0
grade_presentation = 0
grade_communication = 0
count = 0
json.set! :reviews do
	json.array!(@reviews) do |review|
		count += 1
		grade = review.tutor.grade
		grade_knowledge += review.grade_knowledge
		grade_presentation += review.grade_presentation
		grade_communication += review.grade_communication
		if review.visible
	  	json.description review.description
	  	json.set! :student do
	  		json.extract! review.student, :id, :first_name, :last_name, :picture_url
	  	end
	  end
	end
end
json.grade grade
json.grade_knowledge grade_knowledge/count
json.grade_communication grade_communication/count
json.grade_presentation grade_presentation/count