json.array!(@reviews) do |review|
  json.extract! review, :id, :student_id, :tutor_id, :grade_knowledge, :grade_communication, :grade_presentation, :description
end
