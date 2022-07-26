//Company Directory App - Primary Script File

//preloader function
$(window).on('load', function () {
    if ($('#preloader').length) {
        $('#preloader').delay(1000).fadeOut('slow', function () {
            $(this).remove();
        });
    }
});


//On document ready...
$(document).ready(function() {

    getAllStaff();

    //Get all employees
    function getAllStaff() {
        $.ajax({
            url: "libraries/php/getAll.php",
            type: "GET",
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {
                    $("#allStaff").empty();
                    $("#allDepartments, #departmentResultsDetails, #allSites, #siteResultsDetails").hide();
                    let array = result['data'];
                    let listItem;
                    for (let i = 0; i < array.length; i++) {
                        listItem = '<li class="list-group-item">' 
                            + '<p>' + array[i]['firstName'] + ' ' + array[i]['lastName'] + '</p>'
                            + '<div class="buttonDiv">'
                                + '<button type="button" class="fa-solid fa-user fa-xl fa-fw fa-border readButton"></button>' 
                                + '<button type="button" class="fa-solid fa-user-pen fa-xl fa-fw fa-border editButton"></button>' 
                                + '<button type="button" class="fa-solid fa-user-xmark fa-xl fa-fw fa-border deleteButton"></button>'
                            + '</div>'
                            + '</li>';
                        $("#allStaff").append(listItem);
                    };
                    $("#allStaff").show();
                    getDepartmentNames();
                    getSiteNames();
                    $("#staffResultsDetails").show();
                };
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };

    //Get all departments
    function getAllDepartments() {
        $.ajax({
            url: "libraries/php/getAllDepartments.php",
            type: "GET",
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {
                    $("#allDepartments").empty();
                    $("#allStaff, #staffResultsDetails, #allSites, #siteResultsDetails").hide();
                    let array = result['data'];
                    let listItem;
                    for (let i = 0; i < array.length; i++) {
                        listItem = '<li class="list-group-item">' 
                            + '<p>' + array[i]['name'] + '</p>'
                            + '<div class="buttonDiv">'
                                + '<button type="button" class="fa-solid fa-briefcase fa-xl fa-fw fa-border readButton"></button>' 
                                + '<button type="button" class="fa-solid fa-pen fa-xl fa-fw fa-border editButton"></button>' 
                                + '<button type="button" class="fa-solid fa-trash fa-xl fa-fw fa-border deleteButton"></button>'
                            + '</div>'
                            + '</li>';
                        $("#allDepartments").append(listItem);
                    };
                    $("#allDepartments").show();
                    getSiteNames();
                    $("#departmentResultsDetails").show();
                };
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };

    //Get all sites
    function getAllSites() {
        $.ajax({
            url: "libraries/php/getAllSites.php",
            type: "GET",
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {
                    $("#allSites").empty();
                    $("#allDepartments, #allStaff, #departmentResultsDetails, #staffResultsDetails").hide();                   
                    let array = result['data'];
                    let listItem;
                    for (let i = 0; i < array.length; i++) {
                        listItem = '<li class="list-group-item">' 
                            + '<p>' + array[i]['name'] + '</p>'
                            + '<div class="buttonDiv">'
                                + '<button type="button" class="fa-solid fa-industry fa-xl fa-fw fa-border readButton"></button>'
                                + '<button type="button" class="fa-solid fa-pen fa-xl fa-fw fa-border editButton"></button>' 
                                + '<button type="button" class="fa-solid fa-trash fa-xl fa-fw fa-border deleteButton"></button>'
                            + '</div>'
                            + '</li>';
                        $("#allSites").append(listItem);
                    };
                    $("#allSites").show();
                    $("#siteResultsDetails").show();
                };
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };

    //Get department names for select modal
    function getDepartmentNames() {
        $.ajax({
            url: "libraries/php/getAllDepartments.php",
            type: "GET",
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {
                    let array = result['data'];
                    populateDepartmentModal(array);
                };
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };

    //Get site names for select modal
    function getSiteNames() {
        $.ajax({
            url: "libraries/php/getAllSites.php",
            type: "GET",
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {                   
                    let array = result['data'];
                    populateSiteModal(array);
                };
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };

    //Other Functions
    //Populate department select modal
    function populateDepartmentModal(data) {
        $("#departmentSelectModalBody").empty();
        const control = '<div class="form-check">'
            + '<input class="form-check-input" type="radio" name="flexRadioDefault" id="selectDepartment0" data-bs-dismiss="modal" checked>'
            + '<label class="form-check-label" for="selectDepartment0">all Departments</label>'
        + '</div>';
        $("#departmentSelectModalBody").append(control);
        let department;
        for (let i = 0; i < data.length; i++) {
            department = '<div class="form-check">'
            + '<input class="form-check-input" type="radio" name="flexRadioDefault" id="selectDepartment' + data[i]["id"] + '" data-bs-dismiss="modal">'
            + '<label class="form-check-label" for="selectDepartment' + data[i]["id"] + '">' + data[i]["name"] + '</label>'
        + '</div>';
        $("#departmentSelectModalBody").append(department);
        };
    };

    //Populate site select modal
    function populateSiteModal(data) {
        $("#siteSelectModalBody").empty();
        const control = '<div class="form-check">'
            + '<input class="form-check-input" type="radio" name="flexRadioDefault" id="selectSite0" data-bs-dismiss="modal" checked>'
            + '<label class="form-check-label" for="selectSite0">all Sites</label>'
        + '</div>';
        $("#siteSelectModalBody").append(control);
        let site;
        for (let i = 0; i < data.length; i++) {
            site = '<div class="form-check">'
            + '<input class="form-check-input" type="radio" name="flexRadioDefault" id="selectSite' + data[i]["id"] + '" data-bs-dismiss="modal">'
            + '<label class="form-check-label" for="selectSite' + data[i]["id"] + '">' + data[i]["name"] + '</label>'
        + '</div>';
        $("#siteSelectModalBody").append(site);
        };
    };

    //Full list select buttons
    $("#allStaffButton").click(function(){
        getAllStaff();        
    });
    $("#allDepartmentsButton").click(function(){
        getAllDepartments();       
    });
    $("#allSitesButton").click(function(){
        getAllSites();       
    });

});
