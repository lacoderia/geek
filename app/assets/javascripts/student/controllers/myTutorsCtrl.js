'use strict';

Geek.controller('MyTutorsController',['$scope','$rootScope','$compile', 'ReviewsService', 'SessionService', 'TutorService', 'DEFAULT_VALUES' ,function($scope, $rootScope, $compile, ReviewsService, SessionService, TutorService, DEFAULT_VALUES){

    $scope.tutorList = [];

    /*
     * Obtiene la posición donde el usuario hizo click y abre el popup con la forma para calificar al tutor
     * */
    $scope.showReviewDetail = function($event, tutor){
        $event.stopPropagation();
        var options = {
            posX: $event.clientX,
            posY: $event.pageY,
            sendReview: $scope.sendReview
        };

        $scope.openReviewDetail($event, tutor, options, DEFAULT_VALUES);
    };

    /*
     * Obtiene la una lista de tutores que le han dado clase al estudiante
     * */
    $scope.getTutorList = function(){
        TutorService.getMyTutors(SessionService.getId()).then(
            function(data){
                if(data){
                    $scope.tutorList = data;
                }

            },
            function (response){
                console.log('Error retrieving the appointments: ' + response);
            }
        );
    };

    $scope.sendReview = function(tutor, tutorReview) {

        var review = {
            'student_id': SessionService.getId(),
            'tutor_id': tutor.id,
            'knowledge' : tutorReview.knowledge,
            'communication': tutorReview.communication,
            'presentation': tutorReview.presentation,
            'comment': tutorReview.comment
        };

        console.log(review);

        /*ReviewsService.sendReview(review).then(
         function(data){
         console.log(data);
         },
         function(response){
         console.log(response);
         }
         );*/

        $scope.closeReviewDetail();
    };

    $scope.getTutorList();

}]);
