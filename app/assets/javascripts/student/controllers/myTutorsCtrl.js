'use strict';

Geek.controller('MyTutorsController',['$scope','$rootScope','$compile', '$timeout', '$translate', 'MessageService', 'ReviewsService', 'SessionService', 'TutorService', 'usSpinnerService', 'DEFAULT_VALUES' ,function($scope, $rootScope, $compile, $timeout, $translate, MessageService, ReviewsService, SessionService, TutorService, usSpinnerService, DEFAULT_VALUES){

    $scope.tutorList = undefined;
    $scope.appointmentButtons = DEFAULT_VALUES.APPOINTMENT_BUTTONS;
    /*
     * Obtiene la posición donde el usuario hizo click y abre el popup con la forma para calificar al tutor
     * */
    $scope.showReviewModal = function($event, tutor){
        $event.stopPropagation();
        var options = {
            posX: $event.clientX,
            posY: $event.pageY,
            sendReview: $scope.sendReview
        };

        $scope.openReviewModal($event, tutor, options, DEFAULT_VALUES);
    };

    /*
     * Obtiene la una lista de tutores que le han dado clase al estudiante
     * */
    $scope.getTutorList = function(){
        $timeout(function(){
            usSpinnerService.spin('my-tutors-spinner');
        }, 0);

        TutorService.getMyTutors(SessionService.getId()).then(
            function(data){
                if(data){
                    $scope.tutorList = data;
                }

            },
            function (response){
                console.log('Error retrieving the appointments: ' + response);
            }
        ).finally(function(){
                usSpinnerService.stop('my-tutors-spinner');
        });
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

        if(review.grade_knowledge && review.grade_communication && review.grade_presentation && review.description) {

            $timeout(function(){
                usSpinnerService.spin('review-modal-spinner');
            }, 0);

            ReviewsService.sendReview(review).then(
                function(data){
                    if(data.student_id) {
                        tutor.has_evaluation = true;

                        tutor.evaluation = {
                            'description': data.description,
                            'grade_communication': data.grade_communication,
                            'grade_knowledge': data.grade_knowledge,
                            'grade_presentation': data.grade_presentation,
                            'timestamp': data.created_at
                        }

                        usSpinnerService.stop('review-modal-spinner');
                        $scope.closeReviewModal();
                    }
                },
                function(response){
                }
            );
        }

    };

    // Muestra el detalle de la calificación que se asignó al tutor
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
     * Cambia el status de un un appointment determinado
     * */
    $scope.callButtonAction = function($event,action,tutor){
        $event.stopPropagation();

        switch (action){
            case 'review':
                $scope.showReviewModal($event, tutor);
                break;
            case 'review-detail':
                $scope.showReviewDetail($event, tutor);
                break;
            case 'send-message':
                $scope.openModalMessage($event,tutor);
                break;
            default:
                break;
        }
    };

    $scope.openModalMessage = function($event,tutor){

        var options = {
            posX: $event.clientX,
            posY: $event.pageY,
            sendMessage: $scope.sendMessage
        };

        $scope.openMessage($event, tutor, options, DEFAULT_VALUES);


    };

    $scope.sendMessage = function(tutor, textMessage){

        if(textMessage){

            var message = {
                tutor_id: tutor.id,
                student_id: SessionService.getId(),
                text: textMessage,
                from_student: true
            }

            $scope.showSpinner();

            MessageService.saveMessage(message).then(
                function(data){
                    if(data){
                        $scope.hideSpinner();
                        $scope.resetMessage();
                        $scope.messageAlertMessagesParams = {
                            type: 'success',
                            message: 'El mensaje ha sido enviado con éxito',
                            icon: true
                        };
                        $scope.setAlert($scope.messageAlertMessagesParams);
                    }
                },
                function(response){
                    $scope.messageAlertMessagesParams = {
                        type: 'danger',
                        message: 'Ocurrió un error an guardar el mensaje. Por favor, intenta de nuevo',
                        icon: true
                    };
                    $scope.setAlert($scope.messageAlertMessagesParams);
                    console.log('Error saving a message: ' + response);
                }
            );

        }
    };

    $scope.getTutorList();

}]);
