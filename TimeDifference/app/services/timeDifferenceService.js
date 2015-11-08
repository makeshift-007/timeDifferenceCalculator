/*###############################################################################

Author: Karan Singh Negi
FileName: timeDifferenceService.js
Purpose: Contains service configuration

###############################################################################*/




app.factory('UserRequests', function ($http, TimeOut) {
    return {
        CheckLoginInfo: function (loginInfo) {

            debugger;
            var urlpath = HostInfo + "api/Authenticate/AuthenticateToken";
            var enrcyptedInfo = btoa(loginInfo.userName + ":" + loginInfo.password);
            TimeOut.ResetTimer();
            return $http({
                method: 'POST',
                url: urlpath,
                headers: {
                    Authorization: 'Basic ' + enrcyptedInfo
                }
            });
        },

        UpdateUserInfo: function (authToken, userInfo) {

            TimeOut.CheckTimeOut();
            TimeOut.ResetTimer();
            var urlpath = HostInfo + "api/User/ModifyUserInformation";
            return $http({
                method: 'POST',
                url: urlpath,
                headers: {
                    "token": authToken
                },
                data: JSON.stringify({
                    UserName: userInfo.UserName,
                    Email: userInfo.Email,
                    Password: userInfo.password
                }),
            });
        },

        GetUserInformation: function (authToken) {
            TimeOut.CheckTimeOut();
            TimeOut.ResetTimer();
            debugger;
            var urlpath = HostInfo + "api/User/GetUserInformation";
            return $http({
                method: 'POST',
                url: urlpath,
                headers: {
                    "token": authToken
                }
            });
        },

        GetTimeRecordInformation: function (authToken) {
            debugger;
            TimeOut.CheckTimeOut();
            TimeOut.ResetTimer();
            var urlpath = HostInfo + "api/User/GetAllTimeZone?pageNo=1&records=100000";
            return $http({
                method: 'POST',
                url: urlpath,
                headers: {
                    "token": authToken
                }
            });
        },
        RegisterUser: function (registrationInfo) {


            var urlpath = HostInfo + "api/User/RegisterUser";

            return $http({
                method: 'POST', url: urlpath,
                data: JSON.stringify({ Email: registrationInfo.email, Password: registrationInfo.password, UserName: registrationInfo.fullName }),
            });
        },

        CheckEmail: function (emailId) {


            var urlpath = HostInfo + "api/User/IsEmailExist?emailId=" + emailId;

            return $http({
                method: 'POST', url: urlpath,
            });
        },

        GetTimeZoneEntryInformation: function (authToken, timeZoneEntryId) {
            TimeOut.CheckTimeOut();
            TimeOut.ResetTimer();
            var urlpath = HostInfo + "api/User/GetTimeZoneInformation?timeZoneEntryId=" + timeZoneEntryId;
            return $http({
                method: 'POST',
                url: urlpath,
                headers: {
                    "token": authToken
                },
            });

        },
        SaveTimeZoneEntry: function (authToken, timeZoneData) {
            TimeOut.CheckTimeOut();
            TimeOut.ResetTimer();
            var urlpath = HostInfo + "api/User/SaveTimeZone";
            return $http({
                method: 'POST',
                url: urlpath,
                headers: {
                    "token": authToken
                },
                data: JSON.stringify({
                    TimeZoneEntryId: timeZoneData.TimeZoneEntryId,
                    EntryName: timeZoneData.EntryName,
                    City: timeZoneData.City,
                    HourDifference: timeZoneData.Hours,
                    MinuteDifference: timeZoneData.Minutes,

                }),
            });
        },
        RemoveTimeZoneEntry: function (authToken, timeZoneData) {
            TimeOut.CheckTimeOut();
            TimeOut.ResetTimer();
            var urlpath = HostInfo + "api/User/DeleteTimeZoneEntry?timeZoneEntryId=" + timeZoneData;
            return $http({
                method: 'POST',
                url: urlpath,
                headers: {
                    "token": authToken
                },
            });
        },

    };
});


app.factory('ManagerRequests', function ($http, TimeOut) {
    return {
        RemoveUser: function (authToken, userIdForRemoval) {
            TimeOut.CheckTimeOut();
            TimeOut.ResetTimer();
            var urlpath = HostInfo + "api/UserManagement/RemoveUser?userId=" + userIdForRemoval;
            return $http({
                method: 'POST',
                url: urlpath,
                headers: {
                    "token": authToken
                },
            });
        },
        GetUserInformation: function (authToken, userId) {
            TimeOut.CheckTimeOut();
            TimeOut.ResetTimer();
            var urlpath = HostInfo + "api/UserManagement/GetUserInformationById?userId=" + userId;
            return $http({
                method: 'POST',
                url: urlpath,
                headers: {
                    "token": authToken
                }
            });
        },
        UpdateUserInfo: function (authToken, userInfo) {
            TimeOut.CheckTimeOut();
            TimeOut.ResetTimer();
            var urlpath = HostInfo + "api/UserManagement/ModifyUserInformation";
            return $http({
                method: 'POST',
                url: urlpath,
                headers: {
                    "token": authToken
                },
                data: JSON.stringify({
                    UserName: userInfo.UserName,
                    Email: userInfo.Email,
                    UserId: userInfo.UserId,
                    Password: userInfo.password,

                }),
            });
        },
    };
});



app.factory('AdminRequests', function ($http, TimeOut) {
    return {
        UpdateUserInfo: function (authToken, userInfo) {
            TimeOut.CheckTimeOut();
            TimeOut.ResetTimer();
            var urlpath = HostInfo + "api/UserManagement/ModifyUserInformationAdmin";
            return $http({
                method: 'POST',
                url: urlpath,
                headers: {
                    "token": authToken
                },
                data: JSON.stringify({
                    UserName: userInfo.UserName,
                    Email: userInfo.Email,
                    UserId: userInfo.UserId,
                    Role: userInfo.Role,
                    Password: userInfo.password

                }),
            });
        },
        GetTimeZoneEntryInformation: function (authToken, timeZoneEntryId) {
            TimeOut.CheckTimeOut();
            TimeOut.ResetTimer();
            var urlpath = HostInfo + "api/TimeZoneEntryManagement/GetTimeZoneInformation?timeZoneEntryId=" + timeZoneEntryId;
            return $http({
                method: 'POST',
                url: urlpath,
                headers: {
                    "token": authToken
                },
            });

        },
        SaveTimeZoneEntry: function (authToken, timeZoneData) {
            TimeOut.CheckTimeOut();
            TimeOut.ResetTimer();
            var urlpath = HostInfo + "api/TimeZoneEntryManagement/SaveTimeZone";
            return $http({
                method: 'POST',
                url: urlpath,
                headers: {
                    "token": authToken
                },
                data: JSON.stringify({
                    UserId:timeZoneData.UserId,
                    TimeZoneEntryId: timeZoneData.TimeZoneEntryId,
                    EntryName: timeZoneData.EntryName,
                    City: timeZoneData.City,
                    HourDifference: timeZoneData.Hours,
                    MinuteDifference: timeZoneData.Minutes,

                }),
            });
        },
        GetUserTimeZoneEntries: function (authToken, userId) {
            debugger;
            TimeOut.CheckTimeOut();
            TimeOut.ResetTimer();
            var urlpath = HostInfo + "api/TimeZoneEntryManagement/GetUserTimeZoneInformation?" +
                "userId=" + userId +
                "&pageNo=" + 1 +
                "&noOfUserRecords=" + 2147483647 +
                "&timeZoneRecordPageNo=" + 1 +
                "&timeZoneRecordToGet=" + 2147483647;

            

            return $http({
                method: 'POST',
                url: urlpath,
                headers: {
                    "token": authToken
                },
            });
        },

        RemoveTimeZoneEntry: function (authToken, timeZoneData) {
            TimeOut.CheckTimeOut();
            TimeOut.ResetTimer();
            var urlpath = HostInfo + "api/TimeZoneEntryManagement/DeleteTimeZoneEntry?timeZoneEntryId=" + timeZoneData;
            return $http({
                method: 'POST',
                url: urlpath,
                headers: {
                    "token": authToken
                },
            });
        },
    };
});

