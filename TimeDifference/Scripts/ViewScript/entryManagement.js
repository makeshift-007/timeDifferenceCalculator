$("#switch-onText").bootstrapSwitch();

$("#switch-onText").on('switchChange.bootstrapSwitch', function (event, state) {
    timeFormat24 = !timeFormat24;
});

function check() {
    debugger;
    $('#accordion').collapse();
};

check();
