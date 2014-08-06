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
