class User < ActiveRecord::Base

  actable

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable
  
  has_and_belongs_to_many :roles
	has_and_belongs_to_many :addresses

	def role?(role)
		return !!self.roles.find_by_name(role)
	end

end
