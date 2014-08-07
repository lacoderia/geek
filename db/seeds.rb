# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

file_df = File.open('db/sepomex/df.txt', 'r:UTF-8')
while (line = file_df.gets)
	arr = line.encode!('UTF-8', 'UTF-8', :invalid => :replace).split("|")
	# 0 - codigo, 1 - colonia, 3 - delegacion, 4 - estado, 5 - ciudad
	estado = State.find_or_create_by(name: arr[4])
	ciudad = City.find_or_create_by(name: arr[5])
	cp = PostalCode.create(code: arr[0], state_id: estado.id, city_id: ciudad.id)
	colonia = County.create(name: arr[1], postal_code_id: cp.id)
		
end
file_df.close

file_mexico = File.open('db/sepomex/mexico.txt', 'r:UTF-8')
while (line = file_mexico.gets)
	arr = line.encode!('UTF-8', 'UTF-8', :invalid => :replace).split("|")
	# 0 - codigo, 1 - colonia, 3 - delegacion, 4 - estado, 5 - ciudad
	estado = State.find_or_create_by(name: arr[4])	
	ciudad = City.find_or_create_by(name: arr[5])
	cp = PostalCode.create(code: arr[0], state_id: estado.id, city_id: ciudad.id)
	colonia = County.create(name: arr[1], postal_code_id: cp.id)
end
file_mexico.close

role_admin = Role.create(name: 'admin')
role_tutor = Role.create(name: 'tutor')
role_student = Role.create(name: 'student')

User.create(first_name: 'admin', last_name: 'admin', email: 'admin@admin.com', password: 'geek2014', roles: [role_admin])

user_student = User.create(first_name: 'Juan', last_name: 'Estudiante', email: 'juan@estudiante.com', password: 'geek2014', roles: [role_student])
user_tutor = User.create(first_name: 'Ramiro', last_name: 'Tutor', email: 'ramiro@tutor.com', password: 'geek2014', roles: [role_tutor])

student = Student.create(credits: 10.0, openpay_id: "999999", user: user_student)

preference = Preference.create(monday: true, tuesday: true, wednesday: false, thursday: false, friday: true, saturday: true, sunday: true, online: false, only_office: true)
bank_account = BankAccount.create(openpay_id: "3123123", alias: "bank account tutor", holder_name: "Ramiro Tutor", clabe: "234234234234", bank_code: "BMX", bank_name: "BANAMEX", creation_date: Time.now)
tutor = Tutor.create(details: "tutor details", references: "tutor references", background: "tutor background", preference_id: preference.id ,bank_account_id: bank_account.id, calendar_id: "232342af", user: user_tutor)

Review.create(student_id: student.id, tutor_id: tutor.id, grade: 10, description: "abcdefg")

Availability.create(tutor_id: tutor.id, start: Time.now, end: Time.now)

cat_mate = Category.create(name: "matematicas", description: "matematicas")
cat_trig = Category.create(name: "trigonometria", description: "trigonometria", category_id: cat_mate.id)

tutor.categories << cat_mate
tutor.categories << cat_trig

tutor.counties << County.joins(:postal_code).where("code = ?", "07708").first
tutor.counties << County.joins(:postal_code).where("code = ?", "07700").first

appointment_status = AppointmentStatus.create(name: "confirmado")
address = Address.create(description: "Casa privada", line1: "Sucre Norte 234", line2: "Col. Cigarras de Nuevo Leon", county_id: County.joins(:postal_code).where("code = ?", "06600").first)
appointment = Appointment.create(appointment_status_id: appointment_status.id, student_id: student.id, tutor_id: tutor.id, date: Time.now, details: "Detalles de la cita", address_id: address.id)

Message.create(sender_id: student.user.id, recipient_id: tutor.user.id, text: "hola", status: "entregado")

purchase = Purchase.create(openpay_id: "0239490382", description: "purchase description", authorization: "purchase auth", transaction_type: "type test", operation_type: "operation type", method: "credito", creation_date: Time.now, order_id: "234lklj", status: "confirmada", amount: 342, error_message: "mensaje de error", customer_id: "au3kfja", currency: "MXN", is_card: true )

student.purchases << purchase

address_student = Address.create(description: "Casa estudiante", line1: "Sucre Sur 66", line2: "Col. Cigarras de Nuevo Leon", county_id: County.joins(:postal_code).where("code = ?", "06600").first)
address_tutor = Address.create(description: "Casa tutor", line1: "Carabelas 77", line2: "Col. Cigarras de Nuevo Leon", county_id: County.joins(:postal_code).where("code = ?", "06600").first)

student.user.addresses << address_student
tutor.user.addresses << address_tutor
