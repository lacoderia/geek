class Card < ActiveRecord::Base
	belongs_to :user

	def self.register_card user, token
    user_openpay_id = user.get_openpay_id
    result = Payment.add_card(user_openpay_id, token)
    card = nil
    if result[:success] == true
    	Card.where("user_id = ?", user.id).update_all(:active => false)
    	card = Card.create(:openpay_id => result[:result], :user_id => user.id, :active => true)
    end
    card
  end

  def self.register_bank_account user, clabe, holder_name
    user_openpay_id = user.get_openpay_id
    result = Payment.add_account(user_openpay_id, clabe, holder_name)
    card = nil
    error = nil
    if result[:success] == true
    	Card.where("user_id = ?", user.id).update_all(:active => false)
    	card = Card.create(:openpay_id => result[:result], :user_id => user.id, :active => true, :is_bank_account => true)
    else 
      error = result[:error]
    end
    {:card => card, :error => error}
  end

  def self.find_by_user user
  	result = []
  	cards = Card.where("user_id = ?", user.id).order(:id)
  	cards.each do |card |
  		if card.is_bank_account
  			ocard = Payment.get_bank_account(card.openpay_id, user.openpay_id)
  		else
  			ocard = Payment.get_card(card.openpay_id, user.openpay_id)
  		end
  		result.push({:card => card, :openpay_card =>ocard})
  	end  	
  	result
  end

  def self.activate card_id
  	card = Card.find(card_id)
  	Card.where("user_id = ?", card.user_id).update_all(:active => false)
  	card.update_attribute(:active, true)
  	card
  end
end
