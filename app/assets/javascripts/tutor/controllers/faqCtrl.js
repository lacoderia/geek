'use strict';

Geek.controller('FAQController',['$scope','$rootScope', '$filter', 'DEFAULT_VALUES' ,function($scope, $rootScope, $filter, DEFAULT_VALUES){

    $scope.faqList = DEFAULT_VALUES.FAQ;
    $scope.qestionSelected = undefined;

    if($scope.faqList){
        $scope.selectedSection = $scope.faqList[0];
    }

    $scope.setSelectedSection = function(selectedSection){
        $scope.selectedSection = selectedSection;
        $scope.qestionSelected = undefined;
    };

    $scope.setQuestionSelected = function(question){
        $scope.qestionSelected = question;
    };

    $scope.isQuestionSelected = function(question){
        return question == $scope.qestionSelected;
    };

    //Inicializamos el controlador
    $rootScope.$broadcast('initRoot');

}]);