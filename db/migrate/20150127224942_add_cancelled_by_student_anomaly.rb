class AddCancelledByStudentAnomaly < ActiveRecord::Migration
  def change
    if Anomaly.where("code = ?", "4").empty?
      Anomaly.create(name: "Cancelada por estudiante, entre 2 y 0 horas", code: "4")
    end
  end
end
