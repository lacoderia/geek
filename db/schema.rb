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

ActiveRecord::Schema.define(version: 20140807213355) do

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

  create_table "appointment_statuses", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "appointments", force: true do |t|
    t.integer  "appointment_status_id"
    t.integer  "student_id"
    t.integer  "tutor_id"
    t.datetime "date"
    t.text     "details"
    t.integer  "address_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "availabilities", force: true do |t|
    t.datetime "start"
    t.datetime "end"
    t.integer  "tutor_id"
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

  create_table "categories", force: true do |t|
    t.string   "name"
    t.string   "description"
    t.integer  "category_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "categories_tutors", id: false, force: true do |t|
    t.integer "category_id"
    t.integer "tutor_id"
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
    t.integer  "sender_id"
    t.integer  "recipient_id"
    t.text     "text"
    t.string   "status"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "postal_codes", force: true do |t|
    t.string   "code"
    t.integer  "state_id"
    t.integer  "city_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "preferences", force: true do |t|
    t.boolean  "monday"
    t.boolean  "tuesday"
    t.boolean  "wednesday"
    t.boolean  "thursday"
    t.boolean  "friday"
    t.boolean  "saturday"
    t.boolean  "sunday"
    t.boolean  "online"
    t.boolean  "only_office"
    t.datetime "created_at"
    t.datetime "updated_at"
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

  create_table "reviews", force: true do |t|
    t.integer  "student_id"
    t.integer  "tutor_id"
    t.float    "grade"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
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

  create_table "states", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "students", force: true do |t|
    t.float    "credits"
    t.string   "openpay_id"
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
  end

  create_table "users", force: true do |t|
    t.string   "uid"
    t.string   "first_name"
    t.string   "last_name"
    t.boolean  "active"
    t.datetime "created_at"
    t.datetime "updated_at"
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
    t.string   "gender"
    t.string   "picture_url"
    t.string   "phone_number"
    t.integer  "client_id"
    t.string   "client_type"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true

end
