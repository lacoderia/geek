ActiveAdmin.register Student, :as => "Estudiantes" do

  actions :all, :except => [:new, :destroy]

  permit_params :active, :late_shows, :no_shows, :cancellations

  filter :id
  filter :user_first_name, :as => :string
  filter :user_last_name, :as => :string
  filter :user_email, :as => :string
  filter :user_active, :as => :select
  #filter :user_late_shows, :as => :numeric
  filter :user_no_shows, :as => :numeric
  filter :user_cancellations, :as => :numeric

  index :title => "Estudiantes" do
    column :id
    column "Picture", :picture_url, :class => "photo_thumb" do |student|
      #	link_to( (image_tag tutor.picture.url(:thumb)), tutor.picture.url(:original), :target=>"_blank" )
      link_to( (image_tag student.picture_url), student.picture_url, :target=>"_blank" )
    end
    column :first_name
    column :last_name
    column :email
    column :phone_number
    #column :late_shows
    column :no_shows
    column :cancellations
    column :active
    actions :defaults => true
  end

  show do |student|
    attributes_table do
      row "Picture", :picture_url, :class => "photo_thumb" do |student|
        link_to( (image_tag student.picture_url), student.picture_url, :target=>"_blank" )
      end
      row :first_name
      row :last_name
      row :email
      row :phone_number
      #row :late_shows
      row :no_shows
      row :cancellations
      row :active
    end
  end

  form do |f|
    f.inputs "Student details" do
      f.input :picture_url, :hint => f.template.image_tag(f.object.picture_url), :as => :string, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
      f.input :first_name, :as => :string, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
      f.input :last_name, :as => :string, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
      f.input :email, :as => :string, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
      #f.input :gender, :as => :string, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
      f.input	:phone_number, :as => :string, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
      #f.input :details, :as => :string, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
      #f.input :references, :as => :string, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
      #f.input :tier1_rate, :label => "Cost",:as => :string, :input_html => { :disabled => true, :style => "background-color: #d3d3d3;" }
      #f.input :late_shows
      f.input :no_shows
      f.input :cancellations
      f.input :active, :as => :boolean
    end
    f.actions
  end

  csv do
    column :id
    column :first_name
    column :last_name
    column :email
    column :created_at
  end

end
