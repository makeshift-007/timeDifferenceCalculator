app.factory('CommonMethod', function ($location, $uibModal, SessionManagement) {
    return {
        LogOut: function () {
            AuthToken = "";
            $("#ulBasic").show();
            $("#ulUserInfo").hide();
            document.getElementById("lblUserName").innerHTML = "";
            $("#btnManagement").hide();
            $("#btnHome").hide();
            $("#btnEntryManagement").hide();
            SessionManagement.ClearSession();
            $location.path("/");
            return;
        },
        EnableManagement: function () {
            $("#btnManagement").show();
            $("#btnHome").show();
        }, EnableEntryManagement: function () {
            $("#btnEntryManagement").show();
            
        },


        
        DisableManagement: function () {
            $("#btnManagement").hide();
        },
        ManualSlide: function (sectionName) {
            $('html, body').stop().animate({
                scrollTop: $(sectionName).offset().top
            }, 1500, 'easeInOutExpo');
            return;
        },
        //Used to Show Notification
        showNotification: function (message, type) {
            $.notify(message, type);
        },
        showLoading: function () {
            $("#divLoading").show();
        },
        hideLoading: function () {
            $("#divLoading").hide();
        },
        DisplayUserInfo: function (userName) {
            $("#ulBasic").hide();
            $("#ulUserInfo").show();
            document.getElementById("lblUserName").innerHTML = userName;
        },
        DisplayPopUp: function (data, templateUrl, controller, animationsEnabled, returnMethod) {
           
            var modalInstance = $uibModal.open({
                animation: animationsEnabled,
                //templateUrl: 'myModalContent.html',
                //controller: 'ModalInstanceCtrl',
                templateUrl: templateUrl,
                controller: controller,
                backdrop: false,
                size: null,
                resolve: {
                    data: function () {
                        return data;
                    }
                }
            });





            modalInstance.result.then(function (result) {
               
                returnMethod(result);


            }, function () {

            });
        },


    };
});