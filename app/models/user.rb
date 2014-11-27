class User < ActiveRecord::Base

  actable

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

  def role?(role)
    return !!self.roles.find_by_name(role)
  end

end
