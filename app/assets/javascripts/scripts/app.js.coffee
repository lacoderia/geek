@Geek = angular.module 'Geek', ['ngResource', 'pascalprecht.translate']

  .constant 'DEFAULT_VALUES', {
    'LANGUAGE':'es'
  }

  .config ['$translateProvider', ($translateProvider, $rootScope) ->
      $translateProvider.preferredLanguage('es');
  ]

