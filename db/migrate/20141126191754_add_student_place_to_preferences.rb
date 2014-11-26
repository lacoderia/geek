class AddStudentPlaceToPreferences < ActiveRecord::Migration
  def change
  	add_column :preferences, :student_place, :boolean
  end
end
