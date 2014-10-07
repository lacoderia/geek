@Geek.factory 'CountyService', ($rootScope, $http, $q)->

  all = ()->
    deferred = $q.defer()
    promise = deferred.promise

    $http.get '/counties.json'
      .success (data)->
        deferred.resolve data


    promise.then(
      (data)->
        console.log('ENTRE')
      (response)->
        console.log('Error: '.response)
    )




  return {
    all: all
  }