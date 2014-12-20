class Card < ActiveRecord::Base
	belongs_to :student

	def self.register_card student_id, token
    student_openpay = Student.register(student_id)
    result = Payment.add_card(student_openpay, token)
    card = nil
    puts result.to_yaml
    if result[:success] == true
    	Card.where("student_id = ?", student_id).update_all(:active => false)
    	card = Card.create(:openpay_id => result[:result], :token_id => token, :student_id => student_id, :active => true)
    end
    card.to_yaml
    card
  end
end
