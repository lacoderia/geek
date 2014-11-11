ActiveAdmin.register Tutor, :as => "Solicitudes_de Tutores" do
	
	actions :all, :except => [:new, :show, :destroy]
  
	permit_params :approved

	config.filters = false

	controller do
		def scoped_collection
			Tutor.where("approved = ?", false)
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
			f.input :approved
		end
    f.actions
	end
	

end
