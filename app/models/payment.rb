class Payment

  # Crea un usuario en Openpay
  # Recibe:
  # user - un objeto User
  # Regresa un hash:
  # success - true si la operación se realizó con éxito, false de lo contrario
  # result - el id del usuario creado en Openpay
  # error - el mensaje de error si la operación falló
  def self.create_user user
    op = set_openpay
    customers = op.create(:customers)
    request_hash = {
      'external_id' => Time.now.to_s,#user.id,
      "name" => user.first_name,
      "last_name" => user.last_name,
      "email" => user.email,
      "requires_account" => true,
    }
    result = {:success => true, :result => nil, :error => nil}
    begin
      result_hash = customers.create(request_hash)
      result[:result] = result_hash["id"]
    rescue => error
      result[:success] = false
      result[:error] = error
    end
    return result
  end

  # Registra una tarjeta a un usuario
  # Recibe:
  # user_openpay_id - el id de openpay del usuario
  # card_token - el token de la tarjeta de crédito/débito
  # Regresa un hash:
  # success - true si la operación se realizó con éxito, false de lo contrario
  # result - el id de la tarjeta registrada
  # error - el mensaje de error si la operación falló
  def self.add_card user_openpay_id, card_token
    op = set_openpay
    cards = op.create(:cards)
    request_hash = {
      "token_id" => card_token
    }
    result = {:success => true, :result => nil, :error => nil}
    begin
      result_hash = cards.create(request_hash, user_openpay_id)
      result[:result] = result_hash["id"]
    rescue => error
      result[:success] = false
      result[:error] = error
    end
    return result
  end

  # Registra una cuenta bancaria a un usuario
  # Recibe:
  # user_openpay_id - el id de openpay del usuario
  # clabe - la clabe de la cuenta
  # holder_name - el nombre del titular de la cuenta
  # Regresa un hash:
  # success - true si la operación se realizó con éxito, false de lo contrario
  # result - el id de la tarjeta registrada
  # error - el mensaje de error si la operación falló
  def self.add_account user_openpay_id, clabe, holder_name
    op = set_openpay
    accounts = op.create(:bankaccounts)
    request_hash = {
      "holder_name" => holder_name,
      "alias" => "Cuenta bancaria",
      "clabe" => clabe
    }
    result = {:success => true, :result => nil, :error => nil}
    begin
      result_hash = accounts.create(request_hash, user_openpay_id)
      result[:result] = result_hash["id"]
    rescue => error
      result[:success] = false
      result[:error] = error
    end
    return result
  end

  # Obtiene la información de una tarjeta en Openpay
  # Recibe:
  # card_id - el id de Openpay de la tarjeta
  # user_openpay_id - el id de Openpay del usuario
  # Regresa un hash:
  # success - true si la operación se realizó con éxito, false de lo contrario
  # result - un objeto tarjeta con la información
  # error - el mensaje de error si la operación falló
  def self.get_card card_id, user_openpay_id
    op = set_openpay
    cards = op.create(:cards)
    result = {:success => true, :result => nil, :error => nil}
    begin
      result_hash = cards.get(card_id, user_openpay_id)
      result[:result] = result_hash
    rescue => error
      result[:success] = false
      result[:error] = error
    end
    return result
  end

  # Obtiene la información de una cuenta bancaria en Openpay
  # Recibe:
  # user_openpay_id - el id de Openpay de la cuenta bancaria
  # user_id - el id de Openpay del usuario
  # Regresa un hash:
  # success - true si la operación se realizó con éxito, false de lo contrario
  # result - un objeto con la información de la cuenta bancaria
  # error - el mensaje de error si la operación falló
  def self.get_bank_account account_id, user_openpay_id
    op = set_openpay
    accounts = op.create(:bankaccounts)
    result = {:success => true, :result => nil, :error => nil}
    begin
      result_hash = accounts.get(user_openpay_id, account_id)
      result[:result] = result_hash
    rescue => error
      result[:success] = false
      result[:error] = error
    end
    return result
  end

  # Realiza cargo a la tarjeta de un estudiante 
  # Recibe: 
  # user_openpay_id - el id de openpay del estudiante
  # card_id - el id de openpay de la tarjeta del estudiante
  # amount - la cantidad a cobrar
  # Regresa un hash:
  # success - true si la operación se realizó con éxito, false de lo contrario
  # result - el id de la operación
  # error - el mensaje de error si la operación falló
  def self.charge_student user_openpay_id, card_id, amount
    op = set_openpay
    charges = op.create(:charges)
    request_hash = {
      "method" => "card",
      "source_id" => card_id,
      "amount" => amount,
      "description" => "Pago de clase en Geek"
    }
    result = {:success => true, :result => nil, :error => nil}
    begin
      result_hash = charges.create(request_hash, user_openpay_id)
      result[:result] = result_hash["id"]
    rescue => error
      result[:success] = false
      result[:error] = error
    end
    return result
  end

  # Transfiere fondos de la cuenta del estudiante a la del tutor en Openpay
  # Recibe:
  # student_openpay_id - el id de openpay del estudiante
  # tutor_openpay_id - el id de openpay del tutor
  # amount - el monto a transferir
  # Regresa un hash:
  # success - true si la operación se realizó con éxito, false de lo contrario
  # result - el id de la operación
  # error - el mensaje de error si la operación falló
  def self.transfer_funds student_openpay_id, tutor_openpay_id, amount
    op = set_openpay
    transfers = op.create(:transfers)
    request_hash = {
      "customer_id" => tutor_openpay_id,
      "amount" => amount,
      "description" => "Transferencia estudiante-tutor"
    }
    result = {:success => true, :result => nil, :error => nil}
    begin
      result_hash = transfers.create(request_hash, student_openpay_id)
      result[:result] = result_hash["id"]
    rescue => error
      result[:success] = false
      result[:error] = error
    end
    return result
  end

  # Cobra la comisión de Geek al tutor
  # Recibe:
  # user_openpay_id - el id de openpay del tutor
  # amount - el monto a cobrar
  # Regresa un hash:
  # success - true si la operación se realizó con éxito, false de lo contrario
  # result - el id de la operación
  # error - el mensaje de error si la operación falló
  def self.charge_fee user_openpay_id, amount
    op = set_openpay
    fees = op.create(:fees)
    request_hash = {
      "customer_id" => user_openpay_id,
      "amount" => amount,
      "description" => "Cobro de comisión Geek"
    }
    result = {:success => true, :result => nil, :error => nil}
    begin
      result_hash = fees.create(request_hash)
      result[:result] = result_hash["id"]
    rescue => error
      result[:success] = false
      result[:error] = error
    end
    return result
  end

  # Realiza una transferencia a la cuenta bancaria o tarjeta de débito de un tutor
  # Recibe:
  # user_openpay_id - el id de openpay del tutor
  # account_id - el id de openpay de la cuenta bancaria o tarjeta de débito
  # amount - el monto a transferir
  # Regresa un hash:
  # success - true si la operación se realizó con éxito, false de lo contrario
  # result - el id de la operación
  # error - el mensaje de error si la operación falló
  def self.pay_tutor user_openpay_id, account_id, amount
    op = set_openpay
    payouts = op.create(:payouts)
    request_hash={
      "method" => "bank_account",
      "destination_id" => account_id,   
      "amount" => amount,
      "description" => "Retiro de saldo"
    }
    result = {:success => true, :result => nil, :error => nil}
    begin
      result_hash = payouts.create(request_hash, user_openpay_id)
      result[:result] = result_hash["id"]
    rescue => error
      result[:success] = false
      result[:error] = error
    end
    return result
  end

  def self.set_openpay
    openpay = OpenpayApi.new(ENV['OPENPAY_CLIENT_ID'], ENV['OPENPAY_CLIENT_SECRET'])
  end
  
  private_class_method :set_openpay

end