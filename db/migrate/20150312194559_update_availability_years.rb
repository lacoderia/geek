class UpdateAvailabilityYears < ActiveRecord::Migration
  def change
    Availability.where("start < '2000-01-01'").each do |availability|
      availability.start = Time.zone.parse(availability.start.to_yaml.gsub!('0001','2000'))
      availability.end = Time.zone.parse(availability.end.to_yaml.gsub!('0001','2000'))
      availability.save!
    end
  end
end
