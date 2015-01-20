class User < ActiveRecord::Base

  actable

  after_update :block_if_anomaly_count_exceeded

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable
  
  has_and_belongs_to_many :roles
  has_and_belongs_to_many :addresses
  has_many :registered_anomalies
  has_many :reported_anomalies, :foreign_key => "source_id", :class_name => "RegisteredAnomaly"

  has_many :sent_messages, :foreign_key => "sender_id", :class_name => "Message"
  has_many :received_messages, :foreign_key => "recipient_id", :class_name => "Message"
  has_many :cards

  def role?(role)
    return !!self.roles.find_by_name(role)
  end

  def get_openpay_id 
    unless self.openpay_id?
      result = Payment.create_user self
      if result[:success] == true
        self.update_attribute(:openpay_id, result[:result])
      end
    end
    self.openpay_id
  end

  def block_if_anomaly_count_exceeded
    
    if self.no_shows_changed? or self.cancellations_changed? # or self.late_shows_changed?

      no_shows = 5
      cancellations = 10
      #late_shows = 30
    
      if self.no_shows_changed?
        if (self.no_shows % no_shows == 0)
          self.update_column(:active, false)
        end
      #elsif self.late_shows_changed?
      #  if (self.late_shows % late_shows == 0)
      #    self.update_column(:active, false)
      #  end
      elsif self.cancellations_changed?
       if (self.cancellations % cancellations == 0)
          self.update_column(:active, false)
        end
      end

    end

  end

end
