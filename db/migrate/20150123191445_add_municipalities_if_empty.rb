class AddMunicipalitiesIfEmpty < ActiveRecord::Migration
  def change
    file_df = File.open('db/sepomex/zonas_depuradas.txt', 'r:UTF-8')
    while (line = file_df.gets)
      arr = line.encode!('UTF-8', 'UTF-8', :invalid => :replace).split("|")
      estado = State.find_or_create_by(name: arr[4])
      ciudad = City.find_or_create_by(name: arr[5])
      municipio = Municipality.find_or_create_by(name: arr[3])
      if not cp = PostalCode.find_by_code(arr[0])
        cp = PostalCode.create(code: arr[0], state_id: estado.id, city_id: ciudad.id, municipality_id: municipio.id)
      elsif not cp.municipality_id
        cp.update_attribute(:municipality_id, municipio.id)
      end
    end
    file_df.close
  end
end
