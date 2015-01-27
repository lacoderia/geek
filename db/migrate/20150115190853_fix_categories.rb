class FixCategories < ActiveRecord::Migration
  def change
    Category.all.each do |category|
      category_to_keep = Category.where("name = ? AND id <> ?", I18n.transliterate(category.name).upcase, category.id).first
      if category_to_keep
        category_to_keep.tutors << category.tutors
        category.categories_tutors.each do |ct|
          CategoriesTutor.create(category_id: ct.category_id, tutor_id: ct.tutor, cost: ct.cost)
        end
        category.categories_tutors.destroy_all
        category.destroy
      else
        category.update_attribute(:name, I18n.transliterate(category.name).upcase)
      end
    end
  end
end
