'use strict';

Geek.controller('FAQController',['$scope','$rootScope', 'DEFAULT_VALUES' ,function($scope, $rootScope, DEFAULT_VALUES){

    $scope.faqList = [
        {
            section: 'General',
            sectionClass: 'bgcolor-green',
            questions: [
                {q: 'Q. ¿Qué es Geek?', a:  'A. Fundada en enero 2014 y basada en México D.F., Geek es una plataforma en línea que conecta a estudiantes con tutores que ofrecen clases en distintas materias dentro de las siguientes categorías: Académico, Idiomas, Exámenes, Artes y Computación. En Geek, puedes buscar una materia que te interese aprender, y ver una lista de tutores particulares con su perfil, descripción, credenciales, reseñas, calificaciones, precio, disponibilidad, y puedes agendar y pagar una clase directamente a través de la plataforma. En Geek queremos que los estudiantes se enfoquen en aprender, y los tutores se enfoquen en enseñar, ¡nosotros nos encargamos del resto! '}
            ]
        },
        {
            section: 'FAQ\'S ESTUDIANTES',
            sectionClass: 'bgcolor-orange',
            questions: [
                {q: 'Q. ¿Qué es Geek?', a:  'A. Fundada en enero 2014 y basada en México D.F., Geek es una plataforma en línea que conecta a estudiantes con tutores que ofrecen clases en distintas materias dentro de las siguientes categorías: Académico, Idiomas, Exámenes, Artes y Computación. En Geek, puedes buscar una materia que te interese aprender, y ver una lista de tutores particulares con su perfil, descripción, credenciales, reseñas, calificaciones, precio, disponibilidad, y puedes agendar y pagar una clase directamente a través de la plataforma. En Geek queremos que los estudiantes se enfoquen en aprender, y los tutores se enfoquen en enseñar, ¡nosotros nos encargamos del resto! '}
            ]
        },
    ];

}]);