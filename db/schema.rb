# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150506165648) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "unaccent"

  create_table "addresses", force: true do |t|
    t.string   "description"
    t.string   "line1"
    t.string   "line2"
    t.integer  "county_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "addresses_users", id: false, force: true do |t|
    t.integer "address_id"
    t.integer "user_id"
  end

  create_table "admin_users", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "admin_users", ["email"], name: "index_admin_users_on_email", unique: true, using: :btree
  add_index "admin_users", ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true, using: :btree

  create_table "anomalies", force: true do |t|
    t.string   "name"
    t.string   "code"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "appointment_statuses", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "code"
  end

  create_table "appointments", force: true do |t|
    t.integer  "appointment_status_id"
    t.integer  "student_id"
    t.integer  "tutor_id"
    t.datetime "start"
    t.datetime "end"
    t.text     "details"
    t.integer  "address_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "appointment_id"
    t.string   "subject"
    t.float    "cost",                  default: 0.0
    t.boolean  "charged",               default: false
    t.boolean  "paid",                  default: false
    t.boolean  "anomaly",               default: false
    t.boolean  "resolved_anomaly",      default: false
    t.text     "log"
  end

  create_table "availabilities", force: true do |t|
    t.integer  "week_day_id"
    t.integer  "preference_id"
    t.datetime "start"
    t.datetime "end"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "bank_accounts", force: true do |t|
    t.string   "openpay_id"
    t.string   "alias"
    t.string   "holder_name"
    t.string   "clabe"
    t.string   "bank_name"
    t.string   "bank_code"
    t.datetime "creation_date"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "banks", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "cards", force: true do |t|
    t.string   "openpay_id"
    t.string   "alias"
    t.integer  "user_id"
    t.boolean  "active"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "is_bank_account", default: false
  end

  create_table "categories", force: true do |t|
    t.string   "name"
    t.string   "description"
    t.integer  "category_id"
    t.string   "picture_url"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "categories_tutors", force: true do |t|
    t.integer "category_id"
    t.integer "tutor_id"
    t.float   "cost",        default: 0.0
  end

  create_table "cities", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "counties", force: true do |t|
    t.string   "name"
    t.integer  "postal_code_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "counties_tutors", id: false, force: true do |t|
    t.integer "county_id"
    t.integer "tutor_id"
  end

  create_table "messages", force: true do |t|
    t.integer  "student_id"
    t.integer  "tutor_id"
    t.text     "text"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "read",         default: false
    t.boolean  "from_student"
  end

  create_table "municipalities", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "postal_codes", force: true do |t|
    t.string   "code"
    t.integer  "state_id"
    t.integer  "city_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "municipality_id"
  end

  create_table "preferences", force: true do |t|
    t.boolean  "online"
    t.boolean  "office"
    t.float    "cost"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "public",        default: false
    t.boolean  "student_place", default: false
  end

  create_table "purchases", force: true do |t|
    t.string   "openpay_id"
    t.string   "description"
    t.string   "authorization"
    t.string   "transaction_type"
    t.string   "operation_type"
    t.string   "method"
    t.string   "creation_date"
    t.string   "order_id"
    t.string   "status"
    t.float    "amount"
    t.string   "error_message"
    t.string   "customer_id"
    t.string   "currency"
    t.boolean  "is_card"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "purchases_students", id: false, force: true do |t|
    t.integer "purchase_id"
    t.integer "student_id"
  end

  create_table "registered_anomalies", force: true do |t|
    t.integer  "anomaly_id"
    t.integer  "user_id"
    t.integer  "source_id"
    t.integer  "appointment_id"
    t.string   "description"
    t.integer  "registered_anomaly_status_id"
    t.float    "fee_student"
    t.float    "fee_tutor"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "registered_anomaly_statuses", force: true do |t|
    t.string   "name"
    t.string   "code"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "reviews", force: true do |t|
    t.integer  "student_id"
    t.integer  "tutor_id"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.float    "grade_knowledge"
    t.float    "grade_communication"
    t.float    "grade_presentation"
    t.boolean  "visible",             default: true
  end

  create_table "roles", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "roles_users", id: false, force: true do |t|
    t.integer "role_id"
    t.integer "user_id"
  end

  create_table "specific_availabilities", force: true do |t|
    t.integer  "tutor_id"
    t.datetime "start"
    t.datetime "end"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "states", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "students", force: true do |t|
    t.float    "credits"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tutors", force: true do |t|
    t.text     "details"
    t.text     "references"
    t.text     "background"
    t.integer  "preference_id"
    t.integer  "bank_account_id"
    t.string   "calendar_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "approved",        default: false
    t.float    "grade",           default: 0.0
  end

  create_table "users", force: true do |t|
    t.string   "uid"
    t.string   "first_name"
    t.string   "last_name"
    t.boolean  "active",                 default: true
    t.string   "openpay_id"
    t.string   "token"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "email",                  default: "",   null: false
    t.string   "encrypted_password",     default: "",   null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,    null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "gender"
    t.string   "picture_url"
    t.string   "phone_number"
    t.integer  "client_id"
    t.string   "client_type"
    t.string   "refresh_token"
    t.string   "picture_id"
    t.integer  "cancellations",          default: 0
    t.integer  "late_shows",             default: 0
    t.integer  "no_shows",               default: 0
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  create_table "vacations", force: true do |t|
    t.datetime "start"
    t.datetime "end"
    t.integer  "tutor_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "week_days", force: true do |t|
    t.string   "day"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "day_number"
  end

end
