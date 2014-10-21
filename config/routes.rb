Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  resources :specific_availabilities

  resources :availabilities

  resources :week_days

  resources :vacations

  resources :preferences

  resources :appointment_statuses

  resources :appointments do
    collection do
      get 'by_tutor'
      get 'by_student'
    end
  end

  resources :messages

  resources :reviews

  resources :bank_accounts

  resources :categories

  resources :purchases

  resources :addresses

  resources :banks

  resources :states

  resources :cities

  resources :postal_codes

  resources :counties

  resources :students

  resources :tutors do
    collection do
      get 'by_county_and_category_ids'
    end
    member do
      get 'availability_list'
      match 'request_class', :via => [:get, :post]
      match 'save_availabilities', :via => [:get, :post]
    end
  end

  resources :roles

  devise_for :users, :controllers => {:registrations => "users/registrations", :sessions => 'users/sessions', :omniauth_callbacks => "users/omniauth_callbacks"}
  devise_scope :user do
    get 'logout', :to => "devise/sessions#destroy"
    get 'signin', :to => "devise/sessions#new"
    get 'signup', :to => "devise/registrations#new"
  end
  resources :users

  get "counties_all" => "counties#find_for_autocomplete", :as => :find_for_autocomplete

  get "tutor" => "tutor_display#landing", :as => :tutor_landing
  
  get "tutor_dashboard" => "tutor_display#landing", :as => :tutor_dashboard

  get "student" => "student_display#landing", :as => :student_landing
  
  get "student_dashboard" => "student_display#landing", :as => :student_dashboard
  
  #get "tutor_registration" => "tutor_display#tutor_registration", :as => :tutor_registration

  #get "student/home" => "student_display#index", :as => :tutor_index

  #get "tutor/home" => "tutor_display#index", :as => :student_index

  #get "tutor/perfil" => "tutor_display#perfil", :as => :tutor_perfil

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'student_display#landing'

end
