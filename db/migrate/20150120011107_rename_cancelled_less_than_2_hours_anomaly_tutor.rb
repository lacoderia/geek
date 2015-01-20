class RenameCancelledLessThan2HoursAnomalyTutor < ActiveRecord::Migration
  def change
    cancelled_less_than_2_hours_anomaly_tutor = Anomaly.find_by_code("2")
    cancelled_less_than_2_hours_anomaly_tutor.update_attribute(:name, "Cancelada por tutor, entre 2 y 0 horas")
  end
end
