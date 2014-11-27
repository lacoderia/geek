class RegisteredAnomaliesController < ApplicationController

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

end
