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

    //State
    let departments = [];
    let sites = [];
    let departmentId = 0;
    let siteId = 0;


    //Initial API calls
    getAllStaff();
    getDepartmentNames();
    getSiteNames();


    //Main select buttons
    $("#allStaffButton").click(function(){
        getAllStaff();
        $(".depSelect").html('all Departments');        
        $(".siteSelect").html('all Sites');
        departmentId = 0;
        siteId = 0;
    });
    $("#allDepartmentsButton").click(function(){
        getAllDepartments();
        $(".depSelect").html('all Departments');
        $(".siteSelect").html('all Sites');
        departmentId = 0;
        siteId = 0;
    });
    $("#allSitesButton").click(function(){
        getAllSites();
        $(".depSelect").html('all Departments');
        $(".siteSelect").html('all Sites');
        departmentId = 0;
        siteId = 0;
    });
    

    // AJAX functions
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
                    for (let i = 0; i < array.length; i++) {
                        let department = {
                            id: array[i]["id"],
                            name: array[i]["name"]
                        }
                        departments.push(department);
                    }
                    populateDepartmentModal();                   
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
                    for (let i = 0; i < array.length; i++) {
                        let site = {
                            id: array[i]["id"],
                            name: array[i]["name"]
                        }
                        sites.push(site);
                    }
                    populateSiteModal();
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
    function populateDepartmentModal() {
        $("#departmentSelectModalBody").empty();
        const control = '<div class="form-check">'
            + '<input class="form-check-input" type="radio" name="flexRadioDefault" id="selectDepartment0" data-bs-dismiss="modal" checked>'
            + '<label class="form-check-label" for="selectDepartment0">all Departments</label>'
        + '</div>';
        $("#departmentSelectModalBody").append(control);
        let department;
        for (let i = 0; i < departments.length; i++) {
            department = '<div class="form-check">'
            + '<input class="form-check-input" type="radio" name="flexRadioDefault" id="selectDepartment' + departments[i]["id"] + '" data-bs-dismiss="modal">'
            + '<label class="form-check-label" for="selectDepartment' + departments[i]["id"] + '">' + departments[i]["name"] + '</label>'
        + '</div>';
        $("#departmentSelectModalBody").append(department);
        };
        addDeptModalClickHandlers();
    };

    //Populate site select modal
    function populateSiteModal() {
        $("#siteSelectModalBody").empty();
        const control = '<div class="form-check">'
            + '<input class="form-check-input" type="radio" name="flexRadioDefault" id="selectSite0" data-bs-dismiss="modal" checked>'
            + '<label class="form-check-label" for="selectSite0">all Sites</label>'
        + '</div>';
        $("#siteSelectModalBody").append(control);
        let site;
        for (let i = 0; i < sites.length; i++) {
            site = '<div class="form-check">'
            + '<input class="form-check-input" type="radio" name="flexRadioDefault" id="selectSite' + sites[i]["id"] + '" data-bs-dismiss="modal">'
            + '<label class="form-check-label" for="selectSite' + sites[i]["id"] + '">' + sites[i]["name"] + '</label>'
        + '</div>';
        $("#siteSelectModalBody").append(site);
        };
        addSiteModalClickHandlers();
    };

    //Department modal click handlers
    function addDeptModalClickHandlers() {
        $("#departmentSelectModalBody > div").each(function() {
            $(this).click(function() {
                let text = $(this).children('label').html();
                $(".depSelect").html(text);
                let department = departments.find(department => department.name === text);
                departmentId = department.id;
                // console.log(departmentId);
            });
        });
    };

    //Site modal click handlers
    function addSiteModalClickHandlers() {
        $("#siteSelectModalBody > div").each(function() {
            $(this).click(function() {
                let text = $(this).children('label').html();
                $(".siteSelect").html(text);
                let site = sites.find(site => site.name === text);
                siteId = site.id;
                console.log(siteId);
            });
        });
    };

});
