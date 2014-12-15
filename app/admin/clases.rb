ActiveAdmin.register Appointment, :as => "Citas" do

  actions :all, :except => [:new, :destroy]
  
  permit_params :start, :end, :cost, :charged, :paid, :anomaly

  filter :appointment_status
  filter :start
  filter :end
  filter :cost
  filter :charged
  filter :paid
  filter :anomaly
  filter :registered_anomalies
  filter :subject

  index :title => "Citas" do
    column :start
    column :end
    column 'Tutor' do |appointment|
      link_to "#{appointment.tutor.first_name} #{appointment.tutor.last_name}", admin_tutore_path(appointment.tutor)
    end
    column 'Student' do |appointment|
      link_to "#{appointment.student.first_name} #{appointment.student.last_name}", admin_estudiante_path(appointment.tutor)
    end
    column 'Appointment Status' do |appointment|
      appointment.appointment_status.name
    end
    column :cost
    column :charged
    column :paid
    column :anomaly
    actions :defaults => true
  end

  show do |appointment|
    attributes_table do
      row :start
      row :end
      row "Tutor" do |appointment|
        link_to "#{appointment.tutor.first_name} #{appointment.tutor.last_name}", admin_tutore_path(appointment.tutor)
      end
      row "Student" do |appointment|
        link_to "#{appointment.student.first_name} #{appointment.student.last_name}", admin_estudiante_path(appointment.tutor)
      end
      row :cost
      row :charged
      row :paid
      row :anomaly
    end
  end

  form do |f|
    f.inputs "Appointment details" do
      f.input :start
      f.input :end
      #f.input :tutor, :as => :string, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
      f.form_buffers.last << (<<END
<li class="string input optional stringish">
  <label class="label">Tutor</label>
  <div style="display: inline-block;">#{f.object.tutor.first_name} #{f.object.tutor.last_name}</div>
</li>
END
).html_safe
      f.form_buffers.last << (<<END
<li class="string input optional stringish">
  <label class="label">Student</label>
  <div style="display: inline-block;">#{f.object.student.first_name} #{f.object.student.last_name}</div>
</li>
END
).html_safe
      f.input :cost
      f.input :charged
      f.input :paid
      f.input :anomaly
    end
    f.actions
  end

end
