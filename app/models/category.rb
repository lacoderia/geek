class Category < ActiveRecord::Base
	has_and_belongs_to_many :tutors
	belongs_to :parent, :foreign_key => "category_id", :class_name => "Category"
end
