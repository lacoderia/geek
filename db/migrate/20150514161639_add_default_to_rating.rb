class AddDefaultToRating < ActiveRecord::Migration
  def change
  	change_column_default :tutors, :rating, 0.0
    Tutor.where("rating is null").update_all("rating = 0.0")
  end
end
