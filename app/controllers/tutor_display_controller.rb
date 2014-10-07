class TutorDisplayController < ApplicationController

	def home
		@tutor = Tutor.find(current_user.client_id)
  end

  def index

  end

  def perfil

  end

end
