var timeFormat24 = true;
var underProcessed = false;
var noOfClocks = 0;
var contexts = [];
var radiusCanvas = [];
var timeZoneIds = [];
//var timeZoneIds = [];
var indexToRemove = [];

var pass;
function SetInfo(input) {
    debugger;
    pass = input.value;
    $("#confirmPassword").prop('required', input.value != "");


};


function checkConfirmPasswordModal(input) {
    debugger;
    if (input.value != pass) {
        input.setCustomValidity('Password Must be Matching.');
    } else {
        // input is valid -- reset the error message
        input.setCustomValidity('');
    }
}

$(document).ready(function () {
    window.setInterval(function () {

        CurrentInActivityTime++;
    }, 1000);
});

//Used to updateNew Time
function UpdateNewTime() {
    var clocks = document.getElementsByClassName("timeLabel");

    for (var k = 0; k < clocks.length; k++) {
        try {
            var timeCurrent = calcTime(clocks[k].getAttribute("data"));
            var hour = timeCurrent.getUTCHours();
            var format = "";
            if (!timeFormat24) {
                if (hour >= 12) {
                    if (hour > 12)
                        hour -= 12;
                    format = " PM";
                } else {
                    if (hour == 0)
                        hour = 12;
                    format = " AM";
                }


            }

            clocks[k].innerHTML = hour + ":" + timeCurrent.getUTCMinutes() + ":" + timeCurrent.getUTCSeconds() + format;
        } catch (ex) {

        }
    }

}

function UpdateTime() {
    debugger;
    try {
        // if (/*!underProcessed &&*/ document.getElementsByClassName("clock").length != 0) {


        //  underProcessed = true;

        var clocks = document.getElementsByClassName("clock");

        if (noOfClocks > clocks.length) {

            for (var l = 0; l < timeZoneIds.length; l++) {

                var flag = false;
                for (var k = 0; k < clocks.length; k++) {
                    var clockId = clocks[k].getAttribute("timzoneid");
                    if (timeZoneIds[l] == parseInt(clockId)) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    indexToRemove.push(l);
                }
            }

            //Removal
            for (var m = 0; m < indexToRemove.length; m++) {
                contexts.splice(indexToRemove[m], 1);
                radiusCanvas.splice(indexToRemove[m], 1);
                timeZoneIds.splice(indexToRemove[m], 1);
            }
            indexToRemove = [];
            noOfClocks = clocks.length;
        }

        if (clocks.length > noOfClocks) {

            for (var z = 0; z < clocks.length; z++) {
                var flag1 = false;
                var clockId1 = clocks[z].getAttribute("timzoneid");

                for (var n = 0; n < timeZoneIds.length; n++) {
                    if (timeZoneIds[n] == parseInt(clockId1)) {
                        flag1 = true;
                        break;
                    }
                }
                if (!flag1) {
                    var contextLocal = clocks[z].getContext("2d");
                    var radiusLocal = clocks[z].height / 2;
                    contextLocal.translate(radiusLocal, radiusLocal);
                    radiusLocal = radiusLocal * 0.90;
                    contexts.push(contextLocal);
                    radiusCanvas.push(radiusLocal);
                    timeZoneIds.push(clocks[z].getAttribute("timzoneid"));
                }
            }

            noOfClocks = clocks.length;
        }


        var canvas = null; //document.getElementById("canvas");
        var ctx = null; //canvas.getContext("2d");
        var radius = null; //canvas.height / 2;


        for (var i = 0; i < contexts.length; i++) {
            var servingClock = clocks[i].getAttribute("timzoneid");
            var indexToServe = -1;

            for (var j = 0; j < timeZoneIds.length; j++) {

                if (timeZoneIds[j] == parseInt(servingClock)) {
                    indexToServe = j;
                    break;
                }
            }

            if (indexToServe >= 0) {
                try {
                    ctx = contexts[indexToServe];
                    radius = radiusCanvas[indexToServe];
                    drawClock(clocks[i].getAttribute("data"), ctx, radius);
                } catch (err) {

                }
            }
        }


        //}
        //else if (document.getElementsByClassName("clock").length == 0) {
        //    contexts = [];
        //    radiusCanvas = [];
        //    timeZoneIds = [];
        //}
    } catch (err1) {
    }
    //underProcessed = false;
}

function drawClock(offset, ctx, radius) {
    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawTime(ctx, radius, offset);
}

function drawFace(ctx, radius) {
    var grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
    grad.addColorStop(0, '#333');
    grad.addColorStop(0.5, 'white');
    grad.addColorStop(1, '#333');
    ctx.strokeStyle = grad;
    ctx.lineWidth = radius * 0.1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
}

function drawNumbers(ctx, radius) {
    var ang;
    var num;
    ctx.font = radius * 0.15 + "px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for (num = 1; num < 13; num++) {
        ang = num * Math.PI / 6;
        ctx.rotate(ang);
        ctx.translate(0, -radius * 0.85);
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius * 0.85);
        ctx.rotate(-ang);
    }
}

function drawTime(ctx, radius, offset) {

    var timeMain = calcTime(offset);

    // var now = new Date();
    var hour = timeMain.getUTCHours();
    var minute = timeMain.getUTCMinutes();
    var second = timeMain.getUTCSeconds();
    //hour
    hour = hour % 12;
    hour = (hour * Math.PI / 6) +
    (minute * Math.PI / (6 * 60)) +
    (second * Math.PI / (360 * 60));
    drawHand(ctx, hour, radius * 0.5, radius * 0.07);
    //minute
    minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
    drawHand(ctx, minute, radius * 0.8, radius * 0.07);
    // second
    second = (second * Math.PI / 30);
    drawHand(ctx, second, radius * 0.9, radius * 0.02);
}

function drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}

function calcTime(offset) {

    var difference = parseFloat(offset);
    var valueInMinutes = difference - (difference % 1);
    valueInMinutes *= 60;
    if (difference % 1 != 0) {
        var remaning = ((Math.abs(difference % 1) * 100) * 60) / 100;
        if (valueInMinutes < 0)
            remaning *= -1;
        valueInMinutes += remaning;
    }


    return new Date(new Date().getTime() + parseInt(valueInMinutes) * 60 * 1000);//.toUTCString().replace(/ GMT$/, "");
}

function checkEmailExist(input, lastEmail) {
    debugger;
    if (input.value != lastEmail) {
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
    } else {
        controlInfo.setCustomValidity('');
    }

};
