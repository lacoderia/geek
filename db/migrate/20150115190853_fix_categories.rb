class FixCategories < ActiveRecord::Migration
  def change
    Category.all.each do |category|
      category_to_keep = Category.where("name = ? AND id <> ?", I18n.transliterate(category.name).upcase, category.id).first
      if category_to_keep
        category.categories_tutors.each do |ct|
          categories_tutor = CategoriesTutor.where("category_id = ? and tutor_id = ?", category_to_keep.id, ct.tutor_id)
          if categories_tutor.empty?
            CategoriesTutor.create(category_id: category_to_keep.id, tutor_id: ct.tutor_id, cost: ct.cost)
          end
        end
        #category_to_keep.tutors << category.tutors
        category.categories_tutors.destroy_all
        category.destroy
      else
        category.update_attribute(:name, I18n.transliterate(category.name).upcase)
      end
    end
  end
end
