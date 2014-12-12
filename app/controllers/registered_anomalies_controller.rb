class RegisteredAnomaliesController < ApplicationController

  def index
    @registered_anomalies = RegisteredAnomaly.all
  end

  # Recibe:
  # appointment_id = id de la cita
  # anomaly_code = código de la anomalía (0 late show, 1 no show, 2 cancelada, 3 otro)
  # description = descripción de la anomalía
  # Regresa:
  # El objeto de registered anomaly en caso que se cree correctamente, nil de lo contrario
  def from_student
    @registered_anomaly = RegisteredAnomaly.from_student(params[:appointment_id], params[:anomaly_code], params[:description])
  end

  # Recibe:
  # appointment_id = id de la cita
  # anomaly_code = código de la anomalía (0 late show, 1 no show, 2 cancelada, 3 otro)
  # description = descripción de la anomalía
  # Regresa:
  # El objeto de registered anomaly en caso que se cree correctamente, nil de lo contrario
  def from_tutor
    @registered_anomaly = RegisteredAnomaly.from_tutor(params[:appointment_id], params[:anomaly_code], params[:description])
  end

  # Recibe:
  # id = id de la registered anomaly
  # Regresa:
  # El objeto de registered anomaly en caso que se cree correctamente, nil de lo contrario
  def assign
    @registered_anomaly = RegisteredAnomaly.find(params[:id])
    @registered_anomaly.assign
  end

  # Recibe:
  # id = id de la registered anomaly
  # Regresa:
  # El objeto de registered anomaly en caso que se cree correctamente, nil de lo contrario
  def reject
    @registered_anomaly = RegisteredAnomaly.find(params[:id])
    @registered_anomaly.reject
  end

  # Recibe:
  # appointment_id = id de la cita
  # user_id = id del usuario que recibirá la anomalía
  # description = descripción de la anomalía
  # fee_student = porcentaje que se le cobra al estudiante
  # fee_tutor = porcentaje sobre el total que se le paga al tutor
  # Regresa:
  # El objeto de registered anomaly en caso que se cree correctamente, nil de lo contrario
  def assign_other
    @registered_anomaly = RegisteredAnomaly.assign_other(params[:appointment_id], params[:user_id], params[:description], params[:fee_student], params[:fee_tutor])
  end

end
