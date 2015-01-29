ActiveAdmin.register Appointment, :as => "Citas" do

  actions :all, :except => [:new, :destroy]
  
  permit_params :start, :end, :cost, :charged, :paid, :anomaly
  
  filter :id
  filter :appointment_status
  filter :subject
  filter :start
  filter :end
  filter :cost
  filter :charged
  filter :paid
  filter :anomaly
  filter :resolved_anomaly
  filter :log, :label => "Payment Error"
  index :title => "Citas" do
    column :id
    column :start
    column :end
    column 'Tutor' do |appointment|
      link_to "#{appointment.tutor.first_name} #{appointment.tutor.last_name}", admin_tutore_path(appointment.tutor)
    end
    column 'Student' do |appointment|
      link_to "#{appointment.student.first_name} #{appointment.student.last_name}", admin_estudiante_path(appointment.student)
    end
    column 'Appointment Status' do |appointment|
      appointment.appointment_status.name
    end
    column :cost
    column :charged
    column :paid
    column :anomaly do |appointment|
      if appointment.anomaly and not appointment.resolved_anomaly 
        link_to 'Resolve', edit_admin_cita_path(appointment)
      elsif appointment.anomaly and appointment.resolved_anomaly 
       "<span class='status_tag yes'>Resolved</span>".html_safe
      else
       "<span class='status_tag no'>No</span>".html_safe
      end
    end
    column "Payment Error" do |appointment|
      if appointment.log
       "<span class='status_tag yes'>Yes</span>".html_safe
      else
       "<span class='status_tag no'>No</span>".html_safe
      end
    end
    actions :defaults => true
  end

  show do |appointment|
    attributes_table do
      row :id
      row :start
      row :end
      row "Tutor" do |appointment|
        link_to "#{appointment.tutor.first_name} #{appointment.tutor.last_name}", admin_tutore_path(appointment.tutor)
      end
      row "Student" do |appointment|
        link_to "#{appointment.student.first_name} #{appointment.student.last_name}", admin_estudiante_path(appointment.student)
      end
      row :cost
      row :charged
      row :paid
      row :anomaly
      row "payment error" do |appointment|
        appointment.log
      end
      if appointment.registered_anomalies.count > 0
        panel "Anomalies" do
          table_for appointment.registered_anomalies do 
            column 'Reported by' do |ra|
              "#{ra.source.first_name} #{ra.source.last_name}" if ra.source
            end
            column 'Against' do |ra|
              "#{ra.user.first_name} #{ra.user.last_name}"
            end
            column 'Type' do |ra|
              "#{ra.anomaly.name}"
            end
            column 'Description' do |ra|
              "#{ra.description}"
            end
            column 'Student Fee' do |ra|
              "#{ra.fee_student}"
            end
            column 'Tutor Fee' do |ra|
              "#{ra.fee_tutor}"
            end
            column 'Resolved' do |ra|
              "#{ra.registered_anomaly_status.name}"
            end
          end
        end
      end
    end
  end

  form do |f|
    f.inputs "Appointment details" do
      f.form_buffers.last << (<<END
<li class="string input optional stringish">
  <label class="label">Tutor</label>
  <div style="display: inline-block;">#{ link_to "#{f.object.tutor.first_name} #{f.object.tutor.last_name}", admin_tutore_path(f.object.tutor) }</div>
</li>
END
).html_safe
      f.form_buffers.last << (<<END
<li class="string input optional stringish">
  <label class="label">Student</label>
  <div style="display: inline-block;">#{ link_to "#{f.object.student.first_name} #{f.object.student.last_name}", admin_estudiante_path(f.object.student)}</div>
</li>
END
).html_safe
      f.input :cost
      f.input :log, :label => "Payment Error", :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
      if f.object.log

        if f.object.charged and f.object.paid
          f.input :charged, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
          f.input :paid, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
        elsif f.object.charged
          f.input :charged, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
          f.form_buffers.last << "<li class='string input optional stringish'> <label class>&nbsp;</label> <a href='#' onclick='forcePayment(#{f.object.id})'>Pay</a></li>".html_safe
        else
          # f.input :charged
          f.form_buffers.last << "<li class='string input optional stringish'> <label class>&nbsp;</label> <a href='#' onclick='forceCharge(#{f.object.id})'>Charge</a></li>".html_safe
          f.input :paid, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
        end
      else
        f.input :charged, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
        f.input :paid, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
      end
      f.input :anomaly, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }

      pending_anomaly = RegisteredAnomalyStatus.find_by_code("0")

      if f.object.anomaly and not f.object.resolved_anomaly
        f.form_buffers.last << "<table><thead><tr><th>Reported by</th><th>Against</th><th>Type</th><th>Description</th><th>Student Fee</th><th>Tutor Fee</th><th>Resolve</th></thead><tbody>".html_safe
        f.has_many :registered_anomalies, :allow_destroy => false, :heading => 'Anomalies', :new_record => false do |cf|
          user = User.find(cf.object.user_id)
          anomaly = Anomaly.find(cf.object.anomaly_id)
          #Si tiene source
          if cf.object.source_id
            source = User.find(cf.object.source_id)
            #Si esta pendiente, se puede asignar
            if cf.object.registered_anomaly_status_id == pending_anomaly.id
              cf.form_buffers.last << "<tr><td>#{source.first_name} #{source.last_name}</td><td>#{user.first_name} #{user.last_name}</td><td>#{anomaly.name}</td><td>#{cf.object.description}</td><td>#{cf.object.fee_student}</td><td>#{cf.object.fee_tutor}</td><td> <a href='#' onclick='assign(#{cf.object.id}, #{f.object.id})'>Assign</a> <a href='#' onclick='reject(#{cf.object.id}, #{f.object.id})'>Reject</a></td></tr>".html_safe
            #Si ya se resolvio, solo informa
            else
              cf.form_buffers.last << "<tr><td>#{source.first_name} #{source.last_name}</td><td>#{user.first_name} #{user.last_name}</td><td>#{anomaly.name}</td><td>#{cf.object.description}</td><td>#{cf.object.fee_student}</td><td>#{cf.object.fee_tutor}</td><td>#{cf.object.registered_anomaly_status.name}</td></tr>".html_safe
            end
          #Si no tiene source (asignado por el admin)
          else
            #Si esta pendiente, se puede asignar
            if cf.object.registered_anomaly_status_id == pending_anomaly.id
              cf.form_buffers.last << "<tr><td>&nbsp;</td><td>#{user.first_name} #{user.last_name}</td><td>#{anomaly.name}</td><td>#{cf.object.description}</td><td>#{cf.object.fee_student}</td><td>#{cf.object.fee_tutor}</td><td> <a href='#' onclick='assign(#{cf.object.id}, #{f.object.id})'>Assign</a> <a href='#' onclick='reject(#{cf.object.id}, #{f.object.id})'>Reject</a></td></tr>".html_safe
            #Si ya se resolvio, solo informa
            else
              cf.form_buffers.last << "<tr><td>&nbsp;</td><td>#{user.first_name} #{user.last_name}</td><td>#{anomaly.name}</td><td>#{cf.object.description}</td><td>#{cf.object.fee_student}</td><td>#{cf.object.fee_tutor}</td><td>#{cf.object.registered_anomaly_status.name}</td></tr>".html_safe
            end
          end
        end
        f.form_buffers.last << "</tbody></table>".html_safe

        f.form_buffers.last << "<a href='#' onclick='assign_other(#{f.object.id}, \"#{new_admin_anomalias_registrada_path}\")'>New Resolution</a>".html_safe
      elsif f.object.anomaly and f.object.resolved_anomaly
        f.form_buffers.last << "<table><thead><tr><th>Reported by</th><th>Against</th><th>Type</th><th>Description</th><th>Resolution</th></thead><tbody>".html_safe
        f.has_many :registered_anomalies, :allow_destroy => false, :heading => 'Anomalies', :new_record => false do |cf|
          source = User.find(cf.object.source_id)
          user = User.find(cf.object.user_id)
          anomaly = Anomaly.find(cf.object.anomaly_id)
          cf.form_buffers.last << "<tr><td>#{source.first_name} #{source.last_name}</td><td>#{user.first_name} #{user.last_name}</td><td>#{anomaly.name}</td><td>#{cf.object.description}</td><td>#{cf.object.registered_anomaly_status.name}</td></tr>".html_safe
        end
        f.form_buffers.last << "</tbody></table>".html_safe
      end
    end
    f.actions
  end

end
