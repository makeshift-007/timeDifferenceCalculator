function checkConfirmPassword(input) {
    debugger;
    if (input.value != document.getElementById('password').value) {
        input.setCustomValidity('Password Must be Matching.');
    } else {
        // input is valid -- reset the error message
        input.setCustomValidity('');
    }
}







var controlInfo = "";
function checkEmailExist(input) {
    debugger;
    controlInfo = input;
    $.ajax({
        url: HostInfo + "api/User/IsEmailExist?emailId=" + input.value,
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            debugger;
            if (data) {
                controlInfo.setCustomValidity('Email Id Already Exist');

            } else {
                controlInfo.setCustomValidity('');
            }

        },
        error: function (data) {
            showNotification("Error while Communicating with server.", "warning");
        }
    });

};

