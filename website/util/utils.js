/**
 *  Utility functions
 */

module.exports = {};

module.exports.parse_date = function(date){
    var error_msg = "Error: Incorrect date format, should be mmddyyyy";
    var result = {
        "error" : false
    };
    
    // sanitize the date
    if (date.length != 8){
        result.error = true;
        result.reason = "Date is not the right length";
        console.log(result.reason);
        return result;
    }

    var mm = parseInt(date.substring(0,2));
    if (mm > 12 || mm < 1){
        result.error = true;
        result.reason = "Illegal month number";
        console.log(result.reason);
        return result;
    }

    var today = new Date();

    var yyyy = parseInt(date.substring(4,8));
    if (yyyy < 2014){
        result.error = true;
        result.reason = "Year must be between 2014 and "+ today.getFullYear();
        console.log(result.reason);
    }

    var max_day = new Date(yyyy, mm, 0).getDate();

    var dd = parseInt(date.substring(2,4));
    if (dd < 1 || dd > max_day){
        result.error = true;
        result.reason = "Day must be between 1 and "+max_day;
        console.log(result.reason);
        return result;
    }

    var that_day = new Date(yyyy, mm, dd);

    result.day = dd;
    result.month = mm;
    result.year = yyyy;
    result.minute = that_day.getMinutes();
    result.hour = that_day.getHours();
    result.dow = that_day.getDay();
    return result;
};

module.exports.get_todays_date = function() {
    // Get todays date
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    var hour = today.getHours();
    var min = today.getMinutes();
    var day_of_week = today.getDay();

    var result = {
        "error" : false,
        "day" : dd,
        "month": mm,
        "year": yyyy,
        "minute": min,
        "hour": hour,
        "dow": day_of_week
    };
    return result;
}

/**
 * Compare date
 * @return {[type]}       -1 if date1 is before date2, 0 if they are the same day/month/year, 1 if date1 is after date2
 */
module.exports.compare_date = function(date1, date2){
    if(date1.year < date2.year) return -1;
    else if (date1.year > date2.year) return 1;
    else{
        if (date1.month < date2.month) return -1;
        else if(date1.month > date2.month) return 1;
        else{
            if (date1.day < date2.day) return -1;
            else if (date1.day > date2.day) return 1;
            else return 0;
        }
    }
}

module.exports.date_is_today = function(date){
    var today = module.exports.get_todays_date();
    return module.exports.compare_date(today, date) == 0;
}

module.exports.pad = function(val, str_size){
    var s = val+"";
    while (s.length < str_size) s = "0" + s;
    return s;
}
