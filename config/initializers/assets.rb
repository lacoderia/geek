# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )

#Precompile styles
Rails.application.config.assets.precompile += %w( styles/display.css )

Rails.application.config.assets.precompile += %w( styles/tutor_display.css )

#Precompile custom assets
Rails.application.config.assets.precompile += %w( student/app.js )
Rails.application.config.assets.precompile += %w( tutor/app.js )

#Import libs
Rails.application.config.assets.precompile += %w( lib/angular/angucomplete-alt.js )
Rails.application.config.assets.precompile += %w( lib/angular/spin.min.js )

#Import Services
Rails.application.config.assets.precompile += %w( student/services/countyService.js )

Rails.application.config.assets.precompile += %w( tutor/services/categoryService.js )

#Import Directives

#Import Controllers
Rails.application.config.assets.precompile += %w( student/controllers/rootCtrl.js )
Rails.application.config.assets.precompile += %w( student/controllers/searchTutorCtrl.js )

Rails.application.config.assets.precompile += %w( tutor/controllers/rootCtrl.js )
Rails.application.config.assets.precompile += %w( tutor/controllers/navigationCtrl.js )


