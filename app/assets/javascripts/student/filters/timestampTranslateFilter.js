Geek.filter('timestampTranslateFilter', function($filter, $translate, DEFAULT_VALUES){
    return function(timestamp){

        var date = new Date(timestamp);
        var timeStr = date.getHours() + ':' + ((date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes());
        var dateStr =  $filter('translate')(DEFAULT_VALUES.MONTHS[date.getMonth()]) + ' ' + date.getDate() + ', ' + (date.getYear() + DEFAULT_VALUES.START_YEAR) + ' ' + timeStr;

        var filteredDate = '';

        var now = new Date();

        var isToday = function(date){
            return now.getDate() == date.getDate() && now.getMonth() == date.getMonth() && now.getFullYear() == date.getFullYear();
        };

        switch ($translate.use()){
            case 'en_US':
                filteredDate = isToday(date)? 'Today ' + timeStr : dateStr ;
                break;
            case 'es_MX':
                filteredDate = isToday(date)? 'Hoy ' + timeStr : dateStr;
                break;
            default :
                filteredDate = isToday(date)? 'Hoy ' + timeStr : dateStr;
                break;
        }

        return filteredDate;

    }
});