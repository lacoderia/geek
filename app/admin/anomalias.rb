ActiveAdmin.register RegisteredAnomaly, :as => "Anomalias Registradas" do

  menu false

  actions :all, :except => [:destroy, :edit, :show]
  
  config.filters = false
  
  permit_params :appointment_id, :anomaly_id, :user_id, :description, :fee_student, :fee_tutor, :registered_anomaly_status_id

  controller do
    def index 
      redirect_to :admin_citas
    end
  end

  form do |f|
    f.inputs "Register Anomaly" do
      if params[:appointment_id]
        appointment = Appointment.find(params[:appointment_id].to_i)
        f.object.appointment_id = params[:appointment_id].to_i
        f.object.anomaly_id = Anomaly.find_by_code("3").id
        f.object.registered_anomaly_status_id = RegisteredAnomalyStatus.find_by_code("1").id
        f.input :appointment_id, :as => :hidden
        f.input :user_id, :label => 'Against', :as => :select, :collection => User.where("id in (?, ?)", appointment.tutor.user.id, appointment.student.user.id).map{|u| ["#{u.first_name} #{u.last_name}", u.id]}
        f.input :anomaly_id, :as => :hidden
        f.input :registered_anomaly_status_id, :as => :hidden
        f.input :description, :placeholder => "Describe the issue"
        f.input :fee_student, :placeholder => "100"
        f.input :fee_tutor, :placeholder => "80"
      end
      f.actions
    end
  end

end
