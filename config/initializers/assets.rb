# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.13'

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )

#Precompile styles
Rails.application.config.assets.precompile += %w( styles/student_display.css )

Rails.application.config.assets.precompile += %w( styles/tutor_display.css )

#Precompile custom assets
Rails.application.config.assets.precompile += %w( student/app.js )
Rails.application.config.assets.precompile += %w( tutor/app.js )

#Import Services
Rails.application.config.assets.precompile += %w( student/services/anomalyService.js )
Rails.application.config.assets.precompile += %w( student/services/appointmentService.js )
Rails.application.config.assets.precompile += %w( student/services/authService.js )
Rails.application.config.assets.precompile += %w( student/services/availabilityService.js )
Rails.application.config.assets.precompile += %w( student/services/categoryService.js )
Rails.application.config.assets.precompile += %w( student/services/countyService.js )
Rails.application.config.assets.precompile += %w( student/services/paymentService.js )
Rails.application.config.assets.precompile += %w( student/services/profileService.js )
Rails.application.config.assets.precompile += %w( student/services/resumeService.js )
Rails.application.config.assets.precompile += %w( student/services/reviewsService.js )
Rails.application.config.assets.precompile += %w( student/services/sessionService.js )
Rails.application.config.assets.precompile += %w( student/services/tutorService.js )
Rails.application.config.assets.precompile += %w( student/services/messageService.js )

Rails.application.config.assets.precompile += %w( tutor/services/anomalyService.js )
Rails.application.config.assets.precompile += %w( tutor/services/appointmentService.js )
Rails.application.config.assets.precompile += %w( tutor/services/authService.js )
Rails.application.config.assets.precompile += %w( tutor/services/availabilityService.js )
Rails.application.config.assets.precompile += %w( tutor/services/balanceService.js )
Rails.application.config.assets.precompile += %w( tutor/services/categoryService.js )
Rails.application.config.assets.precompile += %w( tutor/services/countyService.js )
Rails.application.config.assets.precompile += %w( tutor/services/messageService.js )
Rails.application.config.assets.precompile += %w( tutor/services/paymentService.js )
Rails.application.config.assets.precompile += %w( tutor/services/profileService.js )
Rails.application.config.assets.precompile += %w( tutor/services/resumeService.js )
Rails.application.config.assets.precompile += %w( tutor/services/reviewsService.js )
Rails.application.config.assets.precompile += %w( tutor/services/sessionService.js )

#Import Directives
Rails.application.config.assets.precompile += %w( lib/angular/angular-alert-message-directive.js )
Rails.application.config.assets.precompile += %w( lib/angular/angular-form-alert-directive.js )
Rails.application.config.assets.precompile += %w( lib/angular/angular-image-adjustment.js )
Rails.application.config.assets.precompile += %w( lib/angular/angular-onready-directive.js )
Rails.application.config.assets.precompile += %w( lib/angular/angular-spinner.js )
Rails.application.config.assets.precompile += %w( lib/angular/ng-currency.js )
Rails.application.config.assets.precompile += %w( lib/angular/dirPagination.js )

Rails.application.config.assets.precompile += %w( student/directives/modalAnomalyDrctv.js )
Rails.application.config.assets.precompile += %w( student/directives/modalAppointmentRequestDrctv.js )
Rails.application.config.assets.precompile += %w( student/directives/modalDetailDrctv.js )
Rails.application.config.assets.precompile += %w( student/directives/modalReviewDrctv.js )
Rails.application.config.assets.precompile += %w( student/directives/modalReviewDetailDrctv.js )
Rails.application.config.assets.precompile += %w( student/directives/modalTutorDetailDrctv.js )
Rails.application.config.assets.precompile += %w( student/directives/modalMessageDrctv.js )

Rails.application.config.assets.precompile += %w( tutor/directives/modalAnomalyDrctv.js )
Rails.application.config.assets.precompile += %w( tutor/directives/modalDetailDrctv.js )
Rails.application.config.assets.precompile += %w( tutor/directives/modalMessageDrctv.js )

#Import Controllers
Rails.application.config.assets.precompile += %w( student/controllers/appointmentHistoryCtrl.js )
Rails.application.config.assets.precompile += %w( student/controllers/blockedUserCtrl.js )
Rails.application.config.assets.precompile += %w( student/controllers/calendarCtrl.js )
Rails.application.config.assets.precompile += %w( student/controllers/commonCtrl.js )
Rails.application.config.assets.precompile += %w( student/controllers/messageCtrl.js )
Rails.application.config.assets.precompile += %w( student/controllers/myAppointmentsCtrl.js )
Rails.application.config.assets.precompile += %w( student/controllers/myTutorsCtrl.js )
Rails.application.config.assets.precompile += %w( student/controllers/navigationCtrl.js )
Rails.application.config.assets.precompile += %w( student/controllers/paymentCtrl.js )
Rails.application.config.assets.precompile += %w( student/controllers/profileCtrl.js )
Rails.application.config.assets.precompile += %w( student/controllers/resumeCtrl.js )
Rails.application.config.assets.precompile += %w( student/controllers/rootCtrl.js )
Rails.application.config.assets.precompile += %w( student/controllers/searchTutorCtrl.js )

Rails.application.config.assets.precompile += %w( tutor/controllers/appointmentHistoryCtrl.js )
Rails.application.config.assets.precompile += %w( tutor/controllers/balanceCtrl.js )
Rails.application.config.assets.precompile += %w( tutor/controllers/blockedUserCtrl.js )
Rails.application.config.assets.precompile += %w( tutor/controllers/calendarCtrl.js )
Rails.application.config.assets.precompile += %w( tutor/controllers/messageCtrl.js )
Rails.application.config.assets.precompile += %w( tutor/controllers/navigationCtrl.js )
Rails.application.config.assets.precompile += %w( tutor/controllers/paymentCtrl.js )
Rails.application.config.assets.precompile += %w( tutor/controllers/profileCtrl.js )
Rails.application.config.assets.precompile += %w( tutor/controllers/reviewsCtrl.js )
Rails.application.config.assets.precompile += %w( tutor/controllers/resumeCtrl.js )
Rails.application.config.assets.precompile += %w( tutor/controllers/rootCtrl.js )

#Import Filters
Rails.application.config.assets.precompile += %w( student/filters/dateTranslateFilter.js )
Rails.application.config.assets.precompile += %w( student/filters/timestampTranslateFilter.js )

Rails.application.config.assets.precompile += %w( tutor/filters/dateTranslateFilter.js )
Rails.application.config.assets.precompile += %w( tutor/filters/timestampTranslateFilter.js )




