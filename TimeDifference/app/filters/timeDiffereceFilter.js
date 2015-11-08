/*###############################################################################

Author: Karan Singh Negi
FileName: timeDifference Filter.js
Purpose: Contains filter configuration

###############################################################################*/


app.filter('positive', function () {
    return function (input) {
        if (!input) {
            return 0;
        }

        return Math.abs(input);
    };
});