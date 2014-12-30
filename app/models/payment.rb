class Payment

  # Crea un usuario en Openpay
  # Recibe:
  # user - un objeto User
  # Regresa un hash:
  # success - true si la operación se realizó con éxito, false de lo contrario
  # result - el id del estudiante creado en Openpay
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
      "phone_number" => user.phone_number
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
  # user_id - el id de openpay del usuario
  # card_token - el token de la tarjeta de crédito/débito
  # Regresa un hash:
  # success - true si la operación se realizó con éxito, false de lo contrario
  # result - el id de la tarjeta registrada
  # error - el mensaje de error si la operación falló
  def self.add_card user_id, card_token
    op = set_openpay
    cards = op.create(:cards)
    request_hash = {
      "token_id" => card_token
    }
    result = {:success => true, :result => nil, :error => nil}
    begin
      result_hash = cards.create(request_hash, user_id)
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
  # customer_id - el id de Openpay del usuario
  # Regresa un hash:
  # success - true si la operación se realizó con éxito, false de lo contrario
  # result - un objeto tarjeta con la información
  # error - el mensaje de error si la operación falló
  def self.get_card card_id, customer_id
    op = set_openpay
    cards = op.create(:cards)
    result = {:success => true, :result => nil, :error => nil}
    begin
      result_hash = cards.get(card_id, customer_id)
      result[:result] = result_hash
    rescue => error
      result[:success] = false
      result[:error] = error
    end
    return result
  end

  # Realiza cargo a la tarjeta de un estudiante 
  # Recibe: 
  # student_id - el id de openpay del estudiante
  # card_id - el id de openpay de la tarjeta del estudiante
  # amount - la cantidad a cobrar
  def self.charge_student student_id, card_id, amount
    op = set_openpay
    charges = op.create(:charges)
    request_hash = {
      "method" => "card",
      "source_id" => card_id,
      "amount" => amount,
      "description" => "Pago de clase en Geek"
    }
      #"order_id" => "oid-00051", #claseid
      #"device_session_id" => "kR1MiQhz2otdIuUlQkbEyitIqVMiI16f"
    result = {:success => true, :result => nil, :error => nil}
    begin
      result_hash = charges.create(request_hash, student_id)
      result[:result] = result_hash["id"]
    rescue => error
      result[:success] = false
      result[:error] = error
    end
    return result
  end

  #
  def self.add_account tutor_id, clabe, holder_name
    op = set_openpay
    accounts = op.create(:bankaccounts)
    request_hash = {
      "holder_name" => holder_name,
      "alias" => "Cuenta principal",
      "clabe" => clabe
    }
    result = {:success => true, :result => nil, :error => nil}
    begin
      result_hash = accounts.create(request_hash, tutor_id)
      result[:result] = result_hash["id"]
    rescue => error
      result[:success] = false
      result[:error] = error
    end
    return result
  end

  # Obtiene la información de una cuenta bancaria en Openpay
  # Recibe:
  # account_id - el id de Openpay de la cuenta bancaria
  # customer_id - el id de Openpay del usuario
  # Regresa un hash:
  # success - true si la operación se realizó con éxito, false de lo contrario
  # result - un objeto con la información de la cuenta bancaria
  # error - el mensaje de error si la operación falló
  def self.get_bank_account account_id, customer_id
    op = set_openpay
    accounts = op.create(:bankaccounts)
    result = {:success => true, :result => nil, :error => nil}
    begin
      result_hash = accounts.get(customer_id, account_id)
      result[:result] = result_hash
    rescue => error
      result[:success] = false
      result[:error] = error
    end
    return result
  end

  #
  def self.pay_tutor tutor_id, account_id, amount
    op = set_openpay
    payouts = op.create(:payouts)
    request_hash={
      "method" => "bank_account",
      "destination_id" => account_id,   
      "amount" => amount,
      "description" => "Retiro de saldo semanal"
    }
    #"order_id" => "oid-00021"
    result = {:success => true, :result => nil, :error => nil}
    begin
      result_hash = payouts.create(request_hash, tutor_id)
      result[:result] = result_hash["id"]
    rescue => error
      result[:success] = false
      result[:error] = error
    end
    return result
  end

  #
  def self.transfer_funds student_id, tutor_id, amount
    op = set_openpay
    transfers = op.create(:transfers)
    request_hash = {
      "customer_id" => tutor_id,
      "amount" => amount,
      "description" => "Transferencia estudiante-tutor"
    }
      #"order_id" => "oid-00051", #claseid
    result = {:success => true, :result => nil, :error => nil}
    begin
      result_hash = transfers.create(request_hash, student_id)
      result[:result] = result_hash["id"]
    rescue => error
      result[:success] = false
      result[:error] = error
    end
    return result
  end

  #
  def self.charge_fee tutor_id, amount
    op = set_openpay
    fees = op.create(:fees)
    request_hash = {
      "customer_id" => tutor_id,
      "amount" => amount,
      "description" => "Cobro de comisión Geek"
    }
      #"order_id" => "oid-00051", #claseid
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

  def self.set_openpay
    openpay = OpenpayApi.new(ENV['OPENPAY_CLIENT_ID'], ENV['OPENPAY_CLIENT_SECRET'])
  end
  
  private_class_method :set_openpay

end
