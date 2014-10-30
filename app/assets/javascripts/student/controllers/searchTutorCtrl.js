Geek.controller('SearchTutorController', ["$scope", "$rootScope", "TutorService", function($scope, $rootScope, TutorService){

    //Subject inputted by the user
    $scope.subjectInput = undefined;

    //County selected by the user
    $scope.selectedCountyInput = undefined;

    //Zona ingresada por el usuario
    $scope.countyInput = '';

    $scope.tutorList = [];

    //Find a tutor, by the inputted data by the user
    $scope.searchTutor = function(){
        if ($scope.subjectInput || $scope.selectedCountyInput){

            var categoryId = ($scope.subjectInput) ? $scope.subjectInput.originalObject.id : null;
            var countyId = ($scope.selectedCountyInput) ? $scope.selectedCountyInput.originalObject.id : null;

            TutorService.getTutorByCategoryAndCountyIds(categoryId, countyId).then(
                function(data){
                    if(data){
                        $scope.tutorList = data;

                        console.log(data)
                    }
                },
                function(response){

                    console.log('Error retrieving the counties: ' + response);
                }
            );

        }
    };

    // Show tutor details popup
    $scope.showTutorDetails = function(tutor) {
        $scope.openTutorDetailModal(tutor);
    }

}]);
