class County < ActiveRecord::Base
  belongs_to :postal_code
  has_many :addresses
  has_and_belongs_to_many :tutors

  def self.find_for_autocomplete
    result = []
    
    counties = County.all
    counties.each do |county|
      result << {:id => county.id, :name => county.name, :type => "county"}
    end

    municipalities = Municipality.all
    municipalities.each do |municipality|
      result << {:id => municipality.id, :name => municipality.name, :type => "municipality"}
    end
    return result.sort_by{|hsh| hsh[:name]}
  end
end
