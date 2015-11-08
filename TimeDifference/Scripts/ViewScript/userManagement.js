function LoadContent() {
    angular.element(document.getElementById('MainDashBoard')).scope().ContentChanged(document.getElementById('MainDashBoard').innerHTML);
    //alert("called");
};


$(document).ready(function () {
    

    var table = $('#userDataTable').DataTable({
        processing: true,
        serverSide: true,
        columnDefs: [{ "targets": 'nosort', "orderable": false }],
        ajax: {
            url: HostInfo + "api/UserManagement/GetUsersDataTable",
            type: 'POST',
            headers: {
                "token": AuthToken
            },

        },
        //"initComplete": LoadContent,
        aoColumnDefs: [
            {
                "mRender": function (data, type, full) {
                    var userRole = angular.element(document.getElementById('MainDashBoard')).scope().ShowView();
                    return (userRole ? ("<button class='btn btn-primary' style='margin-left: 1%;' ng-click='UserView(" + data + ")'>View</button>") : "") +
                        "<button class='btn btn-primary' style='margin-left: 1%;' ng-click='EditUser(" + data + ")'>Edit</button>" +
                        "<button class='btn btn-danger' style='margin-left: 1%;'ng-click='RemoveUser(" + data + ")'>Remove</button>";
                },
                "aTargets": [3]
            }
        ]

    });

    $('#userDataTable').on('draw.dt', function () {
        LoadContent();
    });

});