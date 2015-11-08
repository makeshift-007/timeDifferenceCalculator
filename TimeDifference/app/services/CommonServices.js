/*###############################################################################

Author: Karan Singh Negi
FileName: CommonServices.js
Purpose: Contains session configuration, to store information even after view change

###############################################################################*/

app.service("SessionManagement", function () {

    var sessionVariable = [];

    return {

        Set: function (index, data) { sessionVariable[index] = data; },
        Get: function (index) {
            try {
                return sessionVariable[index];
            } catch (e) {
                return null;
            }
        },
        ClearSession: function () { sessionVariable = []; }
    };

});

app.service("TimeOut", function (CommonMethod) {

    var sessionVariable = [];

    return {

        CheckTimeOut: function () {
            if ((CurrentInActivityTime / 60) > parseInt(TokenExpiryTime / 60)) {
                CommonMethod.showNotification("Session Timed Out!!!", 'warning');
                CommonMethod.LogOut();
            }
        },
        ResetTimer: function () {
            CurrentInActivityTime = 0;
        },



    };

});