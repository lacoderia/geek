class AddDefaultToUsersPreference < ActiveRecord::Migration
  def change
    User.where("active is null").update_all("active = true")
    change_column_default :preferences, :public, false
    change_column_default :preferences, :student_place, false
    Preference.where("public is null").update_all("public = false")
    Preference.where("student_place is null").update_all("student_place = false")
    change_column_default :tutors, :grade, 0.0
    Tutor.where("grade is null").update_all("grade = 0.0")
  end
end
