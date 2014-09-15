Rails.application.routes.draw do
  resources :availabilities

  resources :preferences

  resources :appointment_statuses

  resources :appointments

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

  resources :tutors

  resources :roles

  devise_for :users, :controllers => {:registrations => "users/registrations", :sessions => 'users/sessions', :omniauth_callbacks => "users/omniauth_callbacks"}
  devise_scope :user do
	  get 'logout', :to => "devise/sessions#destroy"
	  get 'signin', :to => "devise/sessions#new"
	  get 'signup', :to => "devise/registrations#new"
  end
  resources :users

  get "complete_registration" => "display#complete_registration", :as => :complete_registration
  
	get "home_student" => "display#home_student", :as => :home_student
  
	get "home_tutor" => "display#home_tutor", :as => :home_tutor

	get "counties_all" => "counties#find_for_autocomplete", :as => :find_for_autocomplete

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'display#index'

end
