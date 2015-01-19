class AppointmentStatus < ActiveRecord::Base
  has_many :appointments	

  def self.verify_state_change source_state, new_state
    if (new_state.code == "1" or new_state.code == "2") and (source_state.code == "0")
      return true
    elsif (new_state.code == "4" or new_state.code == "5") and (source_state.code == "3")
      return true
    elsif new_state.code == "3" and source_state.code == "0"
      return true
    else
      return false
    end
  end
end
