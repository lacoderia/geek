class Card < ActiveRecord::Base
	belongs_to :user

	def self.register_card user, token
    user_openpay_id = user.get_openpay_id
    result = Payment.add_card(user_openpay_id, token)
    card = nil
    puts result.to_yaml
    if result[:success] == true
    	Card.where("user_id = ?", user.id).update_all(:active => false)
    	card = Card.create(:openpay_id => result[:result], :user_id => user.id, :active => true)
    end
    card.to_yaml
    card
  end
end
