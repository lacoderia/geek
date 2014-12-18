class MarkAllCurrentUsersActive < ActiveRecord::Migration
  def change
    User.where("active is null").update_all(active: true)
  end
end
