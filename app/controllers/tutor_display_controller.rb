class TutorDisplayController < ApplicationController

	def landing

  end

  def index
    @tutor = Tutor.find(current_user.client_id)
  end

end
