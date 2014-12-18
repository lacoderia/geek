'use strict';

Geek.controller('MyTutorsController',['$scope','$rootScope','$compile', '$translate', 'ReviewsService', 'SessionService', 'TutorService', 'DEFAULT_VALUES' ,function($scope, $rootScope, $compile, $translate, ReviewsService, SessionService, TutorService, DEFAULT_VALUES){

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
            'grade_knowledge' : tutorReview.knowledge,
            'grade_communication': tutorReview.communication,
            'grade_presentation': tutorReview.presentation,
            'description': tutorReview.comment
        };

        ReviewsService.sendReview(review).then(
            function(data){
                if(data.student_id) {
                    tutor.has_evaluation = true;
                    $scope.closeReviewDetail();
                }
            },
            function(response){
            }
        );
    };

    $scope.getTutorList();

}]);
