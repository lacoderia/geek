class CreateOpenpayTutors < ActiveRecord::Migration
  def change
    tutors = Tutor.where("openpay_id is null")
    tutors.each do |tutor|
    	tutor.get_openpay_id
    end
  end
end
