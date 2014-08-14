Rails.application.configure do

  ENV['FACEBOOK_APP_KEY'] = "217482014974292"
  ENV['FACEBOOK_APP_SECRET'] = "ad20e3cb040cede5aa69a70b8872feee"

  ENV['ADDRESS'] = ""
  ENV['HOST'] = ""
  ENV['DOMAIN_NAME'] = ""
  ENV['MAIL_USERNAME'] = ""
  ENV['MAIL_PASSWORD'] = ""

  ENV['GOOGLE_CLIENT_ID'] = "387343070369-2mctkqbrhlph8hs724p4ufj19qerhgea.apps.googleusercontent.com"
  ENV['GOOGLE_CLIENT_SECRET'] = "bcKjkLgdSTexn18dCBNNN9xd"

  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports and disable caching.
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true

  # Adds additional error checking when serving assets at runtime.
  # Checks for improperly declared sprockets dependencies.
  # Raises helpful error messages.
  config.assets.raise_runtime_errors = true

  # Raises error for missing translations
  # config.action_view.raise_on_missing_translations = true
  
  config.action_mailer.smtp_settings = {
    address: ENV["ADDRESS"],
    port: 587,
    domain: ENV["DOMAIN_NAME"],
    authentication: "plain",
    enable_starttls_auto: true,
    user_name: ENV["MAIL_USERNAME"],
    password: ENV["MAIL_PASSWORD"]
  }
  # ActionMailer Config
  config.action_mailer.default_url_options = { :host => ENV["HOST"] }
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.perform_deliveries = true
  config.action_mailer.raise_delivery_errors = false

  config.assets.precompile += %w( zjquery-ui.js )
  config.assets.precompile += %w( autocomplete.css )
  config.assets.precompile += %w( autocomplete.js )
  config.assets.precompile += %w( scripts/controller/rootCtrl.js )

end
