Rails.application.routes.draw do
  resources :registered_anomaly_statuses

  resources :registered_anomalies do
    collection do
      post 'from_student'
      post 'from_tutor'
      post 'assign'
      post 'assign_other'
      post 'reject'
    end
  end

  resources :anomalies

  resources :municipalities

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
    member do
      post 'change_status'
    end
  end

  resources :messages do
    collection do
      get 'conversations'
      get 'by_conversation'
      post 'mark_read'
    end
  end

  resources :reviews do
    collection do
      get 'by_tutor'
    end
  end

  resources :bank_accounts

  resources :categories

  resources :purchases

  resources :addresses

  resources :banks

  resources :states

  resources :cities

  resources :postal_codes

  resources :counties do
    collection do
      get 'find_for_autocomplete'
    end
  end

  resources :students do
    collection do
      get 'profile'
    end
  end

  resources :tutors do
    collection do
      get 'by_county_and_category_ids'
      match 'by_query_params_for_google', :via => [:get, :post]
      get 'profile'
      get 'status'
      get 'by_student'
    end
    member do
      get 'availability_list'
      get 'ranged_availability_list'
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
  
  get "tutor_redirect" => "tutor_display#redirect", :as => :tutor_redirect

  get "student" => "student_display#landing", :as => :student_landing
  
  #get "student_dashboard" => "student_display#landing", :as => :student_dashboard
  
  #get "tutor_registration" => "tutor_display#tutor_registration", :as => :tutor_registration

  #get "student/home" => "student_display#index", :as => :tutor_index

  #get "tutor/home" => "tutor_display#index", :as => :student_index

  #get "tutor/perfil" => "tutor_display#perfil", :as => :tutor_perfil

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'student_display#landing'

end
