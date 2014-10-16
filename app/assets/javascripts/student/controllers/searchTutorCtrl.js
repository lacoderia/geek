Geek.controller('SearchTutorController', function($scope, $rootScope, TutorService){

    //Subject inputted by the user
    $scope.subjectInput = '';

    //County selected by the user
    $scope.selectedCountyInput = undefined;

    //Zona ingresada por el usuario
    $scope.countyInput = '';

    $scope.tutorList = [];

    //Find a tutor, by the inputted data by the user
    $scope.searchTutor = function(){
        if ($scope.selectedCountyInput && $scope.subjectInput){


        }else if($scope.selectedCountyInput){

            TutorService.getTutorByCountyId($scope.selectedCountyInput.originalObject.id).then(
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
        }else if($scope.subjectInput){
            $rootScope.subjectStr = $scope.subjectInput;
            TutorService.getTutorByCategoryId($rootScope.subjectStr).then(
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

});