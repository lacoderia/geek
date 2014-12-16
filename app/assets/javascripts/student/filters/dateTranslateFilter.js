Geek.filter('dateTranslateFilter', function($translate, DEFAULT_VALUES){
    return function(date){

        var filteredDate = '';
        var dateStr =  DEFAULT_VALUES.MONTHS[date.getMonth()] + ' ' + date.getDate() + ', ' + (date.getYear() + DEFAULT_VALUES.START_YEAR) + ' ' + date.getHours() + ':' + date.getMinutes();
        var timeStr = date.getHours() + ':' + date.getMinutes();
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