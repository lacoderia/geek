class UpdateAvailabilityYears < ActiveRecord::Migration
  def change
    Availability.where("start < '2000-01-01'").each do |availability|
      #availability.start = Time.zone.parse(availability.start.to_yaml.gsub!('2000', '0001'))
      #availability.end = Time.zone.parse(availability.end.to_yaml.gsub!('2000', '0001'))
      availability.start = (availability.start.in_time_zone("Central Time (US & Canada)") + 2000.year).in_time_zone("Mexico City")
      availability.end = (availability.end.in_time_zone("Central Time (US & Canada)") + 2000.year).in_time_zone("Mexico City")
      #availability.start = Time.zone.parse(availability.start.to_yaml.gsub!('0001','2000'))
      #availability.end = Time.zone.parse(availability.end.to_yaml.gsub!('0001','2000'))
      availability.save!
    end
  end
end
