/*###############################################################################

Author: Karan Singh Negi
FileName: controller.js
Purpose: Contains controller configuration

###############################################################################*/



//Header Controller
app.controller('HeaderCtrl', function ($scope, $location, UserRequests, CommonMethod, $route) {
    //Enabling Anim
    $scope.animationsEnabled = true;
    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };
    //Till Here

    $scope.ProfileView = function () {
        CommonMethod.showLoading();

        UserRequests.GetUserInformation(AuthToken).success(function (data, status, headers, xhr) {
            CommonMethod.hideLoading();

            CommonMethod.DisplayPopUp(data, "userInfo.html", "ModalInstanceCtrl", $scope.animationsEnabled, function (updateInfomation) {
                CommonMethod.showLoading();

                UserRequests.UpdateUserInfo(AuthToken, updateInfomation).success(function (data, status, xhr, $scope) {
                    CommonMethod.hideLoading();
                    if (data) {
                        CommonMethod.showNotification("Information Updated!!!.", "success");
                        //$route.reload();
                        CommonMethod.DisplayUserInfo(updateInfomation.UserName);
                    }
                    else
                        CommonMethod.showNotification("Something went wrong!!!", "warning");

                }).error(function (data, status) {
                    CommonMethod.hideLoading();
                    CommonMethod.showNotification("Something went wrong!!!", "warning");
                });

            });
        }).error(function (data, status) {
            CommonMethod.LogOut();
        });;

    };


    $scope.logOut = function () {
        CommonMethod.LogOut();
    };

    $scope.Home = function () {
        $location.path("/Dashboard");
    };
    $scope.Management = function () {
        $location.path("/UserManagement");
    };
    $scope.EntryManagement = function () {
        $location.path("/TimeZoneEntryManagement");
    };





});

app.controller('HomeController', function ($scope, $location, UserRequests, CommonMethod, SessionManagement) {

    //Used for login
    $scope.signIn = function () {

        $scope.loginInfo = { userName: $scope.signInName, password: $scope.signInPassword };
        //Checking login info
        CommonMethod.showLoading();
        UserRequests.CheckLoginInfo($scope.loginInfo).success(function (data, status, headers, xhr) {
            debugger;
            AuthToken = headers("token");
            TokenExpiryTime = headers("tokenExpiry");

            UserRequests.GetUserInformation(AuthToken).success(function (data, status, headers, xhr) {
                debugger;
                //  SharingVariables.SetUserInformation(data);
                SessionManagement.Set("UserInfo", data);
                CommonMethod.DisplayUserInfo(data.UserName);
                CommonMethod.hideLoading();
                $location.path("/Dashboard");
                switch (data.Role) {
                    case 1:
                        break;
                    case 2:
                        CommonMethod.EnableManagement();
                        break;
                    case 3:
                        CommonMethod.EnableManagement();
                        CommonMethod.EnableEntryManagement();
                        SessionManagement.Set("EntryManagementUserId", 0);
                        break;
                }
            }).error(function (data, status) {
                debugger;
                CommonMethod.hideLoading();
                CommonMethod.LogOut();
            });;


        }).error(function (data, status) {
            CommonMethod.hideLoading();
            debugger; $("#lblInvalidLogin").show();
        });;
    };

    //Used for signUp
    $scope.signUp = function () {

        $scope.RegistrationInfo = { fullName: $scope.signUp.FullName, email: $scope.signUp.Email, password: $scope.signUp.Password };
        CommonMethod.showLoading();
        UserRequests.RegisterUser($scope.RegistrationInfo).success(function (data, status, xhr, $scope) {
            CommonMethod.hideLoading();
            if (data) {
                CommonMethod.showNotification("Registration Successful. Please login to continue.", "success");
                CommonMethod.ManualSlide("#login");
            }
            else
                CommonMethod.showNotification("Something went wrong while registering", "warning");

        }).error(function (data, status) {
            CommonMethod.hideLoading();
            CommonMethod.showNotification("Something went wrong!!!", "warning");
        });


    };

    $scope.checkEmailExist = function () {
        debugger;
        UserRequests.CheckEmailExist($scope.signUp.Email);
    };
});

app.controller('UserController', function ($scope, UserRequests, CommonMethod, $uibModal, $log, $route, SessionManagement) {



    //Used to get user information
    function init() {
        timeFormat24 = true;
        //Setting user Id
        SessionManagement.Set("EntryManagementUserId", 0);
        $scope.GetUserInformation = SessionManagement.Get("UserInfo");
        if ($scope.GetUserInformation == null)
            CommonMethod.LogOut();

        //Getting Time Record Information
        UserRequests.GetTimeRecordInformation(AuthToken).success(function (data, status, headers, xhr) {
            debugger;
            $scope.TimeRecordInformation = data;
            //$timeout(tick, $scope.tickInterval);
            for (var i = 0; i < $scope.TimeRecordInformation.length; i++) {

                $scope.TimeRecordInformation[i].PresentTime = "";
                var currentData = $scope.TimeRecordInformation[i];
                $scope.TimeRecordInformation[i].ZoneDiff = (currentData.HourDifference < 0 ? "-" : "") + Math.abs(currentData.HourDifference) + "." + ((Math.abs(currentData.MinuteDifference) * 100) / 60);

            }
            //  setInterval(UpdateTime, 1000);
            setInterval(UpdateNewTime, 1000);

        }).error(function (data, status) {
            CommonMethod.LogOut();
        });;
    }
    //MyCode
    init();

    $scope.logOut = function () { CommonMethod.logOut(); };

    //PopUp Code
    $scope.animationsEnabled = true;

    $scope.EditTimeRecord = function (timeZoneEntryId) {
        debugger;
        CommonMethod.showLoading();

        UserRequests.GetTimeZoneEntryInformation(AuthToken, timeZoneEntryId).success(function (data, status, headers, xhr) {
            $scope.ServingTimeZoneEntryId = timeZoneEntryId;
            CommonMethod.hideLoading();
            //Modifying 

            data.differenceType = data.HourDifference < 0 ? "-" : "+";
            data.Hours = data.HourDifference;
            data.Minutes = data.MinuteDifference;

            if (data.HourDifference < 0) {
                data.Hours *= -1;
                data.Minutes *= -1;
            }

            CommonMethod.DisplayPopUp(data, "myModalContent.html", "ModalInstanceCtrl", $scope.animationsEnabled, function (timeZoneResult) {

                timeZoneResult.TimeZoneEntryId = $scope.ServingTimeZoneEntryId;
                if (timeZoneResult.differenceType == "-") {
                    timeZoneResult.Hours *= -1;
                    timeZoneResult.Minutes *= -1;
                }

                CommonMethod.showLoading();

                UserRequests.SaveTimeZoneEntry(AuthToken, timeZoneResult).success(function (data, status, headers, xhr) {
                    CommonMethod.hideLoading();
                    CommonMethod.showNotification("Entry Saved Successfully!!!", "success");
                    $route.reload();

                }).error(function (data, status) {
                    CommonMethod.showNotification("Error while processing request!!", "warning");
                    CommonMethod.hideLoading();
                    CommonMethod.LogOut();
                });;



            });

        }).error(function (data, status) {
            CommonMethod.showNotification("Error while processing request!!", "warning");
            CommonMethod.hideLoading();

        });
    };



    //Used to remove record
    $scope.RemoveTimeRecord = function (timeZoneEntryId) {

        $scope.TimeZoneDeleteId = timeZoneEntryId;

        CommonMethod.DisplayPopUp(null, "confirmDelete.html", "ModalInstanceCtrl", $scope.animationsEnabled, function (timeZoneResult) {
            CommonMethod.showLoading();


            UserRequests.RemoveTimeZoneEntry(AuthToken, $scope.TimeZoneDeleteId).success(function (data, status, headers, xhr) {

                CommonMethod.hideLoading();
                CommonMethod.showNotification("Entry Removed Successfully!!!", "success");
                $route.reload();

            }).error(function (data, status) {
                CommonMethod.showNotification("Error while processing request!!", "warning");
                CommonMethod.hideLoading();

            });

        });
    };


    $scope.open = function () {

        $scope.ServingTimeZoneEntryId = 0;

        CommonMethod.DisplayPopUp(null, "myModalContent.html", "ModalInstanceCtrl", $scope.animationsEnabled, function (timeZoneResult) {

            timeZoneResult.TimeZoneEntryId = $scope.ServingTimeZoneEntryId;
            if (timeZoneResult.differenceType == "-") {
                timeZoneResult.Hours *= -1;
                timeZoneResult.Minutes *= -1;
            }

            CommonMethod.showLoading();

            UserRequests.SaveTimeZoneEntry(AuthToken, timeZoneResult).success(function (data, status, headers, xhr) {
                CommonMethod.hideLoading();
                CommonMethod.showNotification("Entry Saved Successfully!!!", "success");
                $route.reload();

            }).error(function (data, status) {
                CommonMethod.showNotification("Error while processing request!!", "warning");
                CommonMethod.hideLoading();
                CommonMethod.LogOut();
            });;



        });
    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };
    //Till Here


});


app.controller('EntryManagementController', function ($scope, AdminRequests, CommonMethod, $uibModal, $log, $route, SessionManagement, $compile) {

    $scope.oneAtATime = true;

    $scope.groups = [
      {
          title: 'Dynamic Group Header - 1',
          content: 'Dynamic Group Body - 1'
      },
      {
          title: 'Dynamic Group Header - 2',
          content: 'Dynamic Group Body - 2'
      }
    ];

    $scope.items = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addItem = function () {
        var newItemNo = $scope.items.length + 1;
        $scope.items.push('Item ' + newItemNo);
    };

    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };

















    var userIdServing = 0;
    var userInformation;

    //PopUp Code
    $scope.animationsEnabled = true;
    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };


    $scope.ShowAll = false;
    //Used for advance Search
    $scope.AdvSearch = function (userRecord) {

        
        if ($scope.timeZoneInnerQuery.EntryName === undefined || $scope.timeZoneInnerQuery.EntryName.length === 0) {
            $scope.ShowAll = userIdServing!=0;
            return true;
        }
      
        var found = false;
        angular.forEach(userRecord.TimeZoneEntries, function (TimeZoneEntry) {

            if (TimeZoneEntry.EntryName.toLowerCase().indexOf($scope.timeZoneInnerQuery.EntryName.toLowerCase()) > -1) {
                found = true;
                $scope.ShowAll = true;
            }
        });
       

        return found;
    };

    $scope.AddEntry = function (userId) {

        CommonMethod.DisplayPopUp(null, "myModalContent.html", "ModalInstanceCtrl", $scope.animationsEnabled, function (timeZoneResult) {

            timeZoneResult.TimeZoneEntryId = $scope.ServingTimeZoneEntryId;
            if (timeZoneResult.differenceType == "-") {
                timeZoneResult.Hours *= -1;
                timeZoneResult.Minutes *= -1;
            }
            timeZoneResult.UserId = userId;
            CommonMethod.showLoading();

            AdminRequests.SaveTimeZoneEntry(AuthToken, timeZoneResult).success(function (data, status, headers, xhr) {
                CommonMethod.hideLoading();
                CommonMethod.showNotification("Entry Saved Successfully!!!", "success");
                $route.reload();

            }).error(function (data, status) {
                CommonMethod.showNotification("Error while processing request!!", "warning");
                CommonMethod.hideLoading();
                CommonMethod.LogOut();
            });;



        });
    };
    $scope.EditTimeRecord = function (timeZoneEntryId) {
        debugger;
        CommonMethod.showLoading();

        AdminRequests.GetTimeZoneEntryInformation(AuthToken, timeZoneEntryId).success(function (data, status, headers, xhr) {
            $scope.ServingTimeZoneEntryId = timeZoneEntryId;
            CommonMethod.hideLoading();
            //Modifying 

            data.differenceType = data.HourDifference < 0 ? "-" : "+";
            data.Hours = data.HourDifference;
            data.Minutes = data.MinuteDifference;

            if (data.HourDifference < 0) {
                data.Hours *= -1;
                data.Minutes *= -1;
            }

            CommonMethod.DisplayPopUp(data, "myModalContent.html", "ModalInstanceCtrl", $scope.animationsEnabled, function (timeZoneResult) {

                timeZoneResult.TimeZoneEntryId = $scope.ServingTimeZoneEntryId;
                if (timeZoneResult.differenceType == "-") {
                    timeZoneResult.Hours *= -1;
                    timeZoneResult.Minutes *= -1;
                }

                CommonMethod.showLoading();

                AdminRequests.SaveTimeZoneEntry(AuthToken, timeZoneResult).success(function (data, status, headers, xhr) {
                    CommonMethod.hideLoading();
                    CommonMethod.showNotification("Entry Saved Successfully!!!", "success");
                    $route.reload();

                }).error(function (data, status) {
                    CommonMethod.showNotification("Error while processing request!!", "warning");
                    CommonMethod.hideLoading();
                    CommonMethod.LogOut();
                });;



            });

        }).error(function (data, status) {
            CommonMethod.showNotification("Error while processing request!!", "warning");
            CommonMethod.hideLoading();

        });
    };



    //Used to remove record
    $scope.RemoveTimeRecord = function (timeZoneEntryId) {

        $scope.TimeZoneDeleteId = timeZoneEntryId;

        CommonMethod.DisplayPopUp(null, "confirmDelete.html", "ModalInstanceCtrl", $scope.animationsEnabled, function (timeZoneResult) {
            CommonMethod.showLoading();


            AdminRequests.RemoveTimeZoneEntry(AuthToken, $scope.TimeZoneDeleteId).success(function (data, status, headers, xhr) {

                CommonMethod.hideLoading();
                CommonMethod.showNotification("Entry Removed Successfully!!!", "success");
                $route.reload();

            }).error(function (data, status) {
                CommonMethod.showNotification("Error while processing request!!", "warning");
                CommonMethod.hideLoading();

            });

        });
    };


    function init() {

        $scope.timeZoneInnerQuery = {
            EntryName: "",
        };

        $scope.GetUserInformation = SessionManagement.Get("UserInfo");
        userInformation = SessionManagement.Get("UserInfo");
        if ($scope.GetUserInformation == null || $scope.GetUserInformation.Role < 3)
            CommonMethod.LogOut();

        userIdServing = SessionManagement.Get("EntryManagementUserId");
        $scope.SpecificUser = userIdServing != 0;
        $scope.ShowAll = userIdServing != 0;
        // SessionManagement.Set("EntryManagementUserId", 0);
        getUserTimeZoneEntries(userIdServing);
        //Setting the time format to 24
        timeFormat24 = true;
    }
    init();

    function getUserTimeZoneEntries() {
        //Getting Time Record Information
        AdminRequests.GetUserTimeZoneEntries(AuthToken, userIdServing).success(function (data, status, headers, xhr) {
            $scope.UsersTimeRecordInformation = data;
            debugger;
            for (var i = 0; i < $scope.UsersTimeRecordInformation.length; i++) {
                $scope.UsersTimeRecordInformation[i].ItemPresent = false;
                for (var j = 0; j < $scope.UsersTimeRecordInformation[i].TimeZoneEntries.length; j++) {

                    $scope.UsersTimeRecordInformation[i].ItemPresent = true;
                    $scope.UsersTimeRecordInformation[i].TimeZoneEntries[j].PresentTime = "";
                    var currentData = $scope.UsersTimeRecordInformation[i].TimeZoneEntries[j];
                    $scope.UsersTimeRecordInformation[i].TimeZoneEntries[j].ZoneDiff = (currentData.HourDifference < 0 ? "-" : "") + Math.abs(currentData.HourDifference) + "." + ((Math.abs(currentData.MinuteDifference) * 100) / 60);
                }

            }
            setInterval(UpdateNewTime, 1000);

        }).error(function (data, status) {
            CommonMethod.LogOut();
        });;
    }



});


app.controller('UserManagementController', function ($scope, $location, UserRequests, AdminRequests, ManagerRequests, CommonMethod, $uibModal, $log, $route, SessionManagement, $compile) {

    function userInfoUpdateComplete(data, updateInfomation) {
        if (data) {
            CommonMethod.showNotification("Information Updated!!!.", "success");
            $route.reload();
            if (userInformation.UserId == updateInfomation.UserId)
                CommonMethod.DisplayUserInfo(updateInfomation.UserName);
        } else
            CommonMethod.showNotification("Something went wrong!!!", "warning");
    };
    //PopUp Code
    $scope.animationsEnabled = true;
    $scope.ContentChanged = function (NewData) {
        $compile($("#MainDashBoard"))($scope);
    };
    $scope.ShowView = function () {
        return $scope.GetUserInformation.Role == 3;
    };

    $scope.UserView = function (userId) {
        SessionManagement.Set("EntryManagementUserId", userId);
        $location.path("/TimeZoneEntryManagement");
    };

    $scope.EditUser = function (userId) {

        CommonMethod.showLoading();

        ManagerRequests.GetUserInformation(AuthToken, userId).success(function (data, status, headers, xhr) {
            CommonMethod.hideLoading();

            CommonMethod.DisplayPopUp(data, "userInfo.html", "ModalInstanceCtrl", $scope.animationsEnabled, function (updateInfomation) {
                CommonMethod.showLoading();
                if (userInformation.Role != 3) {
                    ManagerRequests.UpdateUserInfo(AuthToken, updateInfomation).success(function (data, status, xhr, $scope) {
                        CommonMethod.hideLoading();
                        userInfoUpdateComplete(data, updateInfomation);

                    }).error(function (data, status) {
                        CommonMethod.hideLoading();
                        CommonMethod.showNotification("Something went wrong!!!", "warning");
                    });
                } else {
                    AdminRequests.UpdateUserInfo(AuthToken, updateInfomation).success(function (data, status, xhr, $scope) {
                        CommonMethod.hideLoading();
                        userInfoUpdateComplete(data, updateInfomation);
                    }).error(function (data, status) {
                        CommonMethod.hideLoading();
                        CommonMethod.showNotification("Something went wrong!!!", "warning");
                    });
                }

            });

        }).error(function (data, status) {
            CommonMethod.LogOut();
        });;

    };

    $scope.RemoveUser = function (userId) {

        CommonMethod.DisplayPopUp(null, "userDelete.html", "ModalInstanceCtrl", $scope.animationsEnabled, function (deleteConfirmation) {
            CommonMethod.showLoading();

            ManagerRequests.RemoveUser(AuthToken, userId).success(function (data, status, xhr, $scope) {
                CommonMethod.hideLoading();
                if (data) {
                    CommonMethod.showNotification("User Removed!!!.", "success");
                    $route.reload();
                }
                else
                    CommonMethod.showNotification("Something went wrong!!!", "warning");

            }).error(function (data, status) {
                CommonMethod.hideLoading();
                CommonMethod.showNotification("Something went wrong!!!", "warning");
            });

        });


    };
    var userInformation;
    //Used to get user information
    function init() {
        debugger;
        $scope.GetUserInformation = SessionManagement.Get("UserInfo");
        userInformation = SessionManagement.Get("UserInfo");
        if ($scope.GetUserInformation == null || $scope.GetUserInformation.Role < 2)
            CommonMethod.LogOut();
        SessionManagement.Set("EntryManagementUserId", 0);
    }
    //MyCode
    init();


    $scope.AddUser = function () {

        CommonMethod.DisplayPopUp(null, "AddUser.html", "ModalInstanceCtrl", $scope.animationsEnabled, function (registrationInfo) {
            CommonMethod.showLoading();

            UserRequests.RegisterUser(registrationInfo).success(function (data, status, xhr, $scope) {
                CommonMethod.hideLoading();
                if (data) {
                    CommonMethod.showNotification("Information Updated!!!.", "success");
                    $route.reload();
                }
                else
                    CommonMethod.showNotification("Something went wrong!!!", "warning");

            }).error(function (data, status) {
                CommonMethod.hideLoading();
                CommonMethod.showNotification("Something went wrong!!!", "warning");
            });

        });
    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

});

//PopUp Controller
//Create Edit TimeZone
app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, data, UserRequests, SessionManagement) {

    var prevEmailVal = "";
    var isNonAdmin = true;
    function init() {
        debugger;

        if (data == null) {
            $scope.data = {
                differenceType: "+",
                isNonAdmin: SessionManagement.Get("UserInfo").Role != 3,

            };

        } else {
            $scope.data = data;
            if (data.Email != null) {
                prevEmailVal = data.Email;
                $scope.data.isNonAdmin = SessionManagement.Get("UserInfo").Role != 3;
            }
        }

    }

    init();
    $scope.checkEmailExistModal = function (input, value) {
        debugger;
        value = $scope.data.Email;
        if (prevEmailVal != value) {

            UserRequests.CheckEmail(value).success(function (data, status, xhr, $scope) {
                if (data) {
                    debugger;
                    $("#email").get(0).setCustomValidity('Email Id Already Exist');

                } else {
                    $("#email").get(0).setCustomValidity('');
                }

            }).error(function (data, status) {
                debugger;
            });

        } else {
            $("#email").get(0).setCustomValidity('');
        }

    };

    $scope.ok = function () {

        pass = "";
        $uibModalInstance.close($scope.data);

    };

    $scope.cancel = function () {

        pass = "";
        $uibModalInstance.dismiss('cancel');
    };
});
//Create EditTimeZone
//Till Here
