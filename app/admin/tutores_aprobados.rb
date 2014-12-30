ActiveAdmin.register Tutor, :as => "Tutores" do

  actions :all, :except => [:new, :destroy]

  permit_params :approved, :active

  filter :user_first_name, :as => :string
  filter :user_last_name, :as => :string
  filter :user_email, :as => :string
  filter :user_active, :as => :select

  controller do
    def scoped_collection
      Tutor.where("approved = ?", true)
    end
  end

  index :title => "Tutores" do
    column "Picture", :picture_url, :class => "photo_thumb" do |tutor|
      #	link_to( (image_tag tutor.picture.url(:thumb)), tutor.picture.url(:original), :target=>"_blank" )
      link_to( (image_tag tutor.picture_url), tutor.picture_url, :target=>"_blank" )
    end
    column :first_name
    column :last_name
    column :email
    column :phone_number
    actions :defaults => true
  end

  show do |tutor|
    attributes_table do
      row "Picture", :picture_url, :class => "photo_thumb" do |tutor|
        link_to( (image_tag tutor.picture_url), tutor.picture_url, :target=>"_blank" )
      end
      row :first_name
      row :last_name
      row :email
      row :phone_number
      row :background
      row :active
      row 'Categories' do |tutor|
        tutor.categories.map { |category|
          category.name
        }.join("<br/>").html_safe
      end
      row 'Counties' do |tutor|
        tutor.counties.map { |county|
          county.name
        }.join("<br/>").html_safe
      end
    
      if tutor.reviews.count > 0
        panel "Reviews" do
          table_for tutor.reviews do 
            column "Student" do |review|
              link_to "#{review.student.first_name} #{review.student.last_name}", admin_estudiante_path(review.student)
            end
            column :description
            column :grade_knowledge
            column :grade_communication
            column :grade_presentation
            column :visible
          end
        end
      end
			
    end
  end

  form do |f|
    f.inputs "Tutor details" do
      f.input :picture_url, :hint => f.template.image_tag(f.object.picture_url), :as => :string, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
      f.input :first_name, :as => :string, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
      f.input :last_name, :as => :string, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
      f.input :email, :as => :string, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
      #f.input :gender, :as => :string, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
      f.input	:phone_number, :as => :string, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
      #f.input :details, :as => :string, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
      #f.input :references, :as => :string, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
      f.input	:background, :as => :string, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
      #f.input :tier1_rate, :label => "Cost",:as => :string, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
      f.input :active, :as => :boolean
      if f.object.reviews.count > 0
        f.form_buffers.last << "<table><thead><tr><th>Student</th><th>Description</th><th>Knowledge</th><th>Communication</th><th>Presentation</th><th>Visible</th></thead><tbody>".html_safe
        f.has_many :reviews, :allow_destroy => false, :heading => "Reviews", :new_record => false do |review|

          review.form_buffers.last << "<tr><td>#{review.object.student.first_name} #{review.object.student.last_name}</td><td>#{review.object.description}</td><td>#{review.object.grade_knowledge}</td><td>#{review.object.grade_communication}</td><td>#{review.object.grade_presentation}</td><td>#{ review.object.visible ? (check_box_tag "visible_link_#{review.object.id}", "visible", true, :onclick => "changeVisible(#{review.object.id}, false)") : (check_box_tag "visible_link_#{review.object.id}", "visible", false, :onclick => "changeVisible(#{review.object.id}, true)") }</td></tr>".html_safe
        end
        f.form_buffers.last << "</tbody></table>".html_safe
      end
    end
    f.actions
  end


end
