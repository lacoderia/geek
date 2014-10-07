@Geek.controller 'RootController', ($scope, $rootScope, CountyService, DEFAULT_VALUES)->

  #Counties catalog
  $rootScope.counties = []

  #Call a service to fill in the counties catalog
  console.log CountyService.all()



