@Geek.factory 'CountyService', ($rootScope, $resource, $q)->

  return $resource '/counties.json'