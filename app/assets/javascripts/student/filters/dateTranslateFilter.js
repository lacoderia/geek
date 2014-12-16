Geek.filter('dateTranslateFilter', function($filter, $translate, DEFAULT_VALUES){
    return function(isoDate){

        var filteredDate = '';

        if (isoDate) {
            var date = new Date(isoDate);

            switch ($translate.use()){
                case 'en_US':
                    filteredDate = $filter('translate')(DEFAULT_VALUES.MONTHS[date.getMonth()]) + ' ' + date.getDate() + ', ' + (date.getYear() + DEFAULT_VALUES.START_YEAR);
                    break;
                case 'es_MX':
                    filteredDate = $filter('translate')(DEFAULT_VALUES.DAYS[date.getDay()].title) + ', ' + date.getDate() + ' de ' + $filter('translate')(DEFAULT_VALUES.MONTHS[date.getMonth()]);
                    break;
                default :
                    filteredDate = $filter('translate')(DEFAULT_VALUES.DAYS[date.getDay()].title) + ', ' + date.getDate() + ' de ' + $filter('translate')(DEFAULT_VALUES.MONTHS[date.getMonth()]);
                    break;
            }
        }

        return filteredDate;
    }
});