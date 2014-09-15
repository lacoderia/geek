@Geek.controller 'RootController', ($scope, $rootScope, $cookieStore, CountyService, DEFAULT_VALUES)->

  $rootScope.laguage = $cookieStore.get('language')

  if $rootScope.language
    console.log $rootScope.language
  else
    $rootScope.language = DEFAULT_VALUES.LANGUAGE

  $scope.counties = CountyService.getAllItems()

