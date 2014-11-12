class CategoriesTutor < ActiveRecord::Base
  belongs_to :tutor
  belongs_to :category
end
