class CustomFailure < Devise::FailureApp
  def redirect_url
    #Error si hubo problema en el login, ya esta manejado TODO: BORRAR
    "/error" 
  end

  # You need to override respond to eliminate recall
  def respond
    if http_auth?
      http_auth
    else
      redirect
    end
  end
end
