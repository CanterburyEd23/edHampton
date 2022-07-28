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
            url: "libraries/php/getAllStaff.php",
            type: "GET",
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {
                    $("#allStaff").empty();
                    $("#allDepartments, #departmentResultsDetails, #allSites, #siteResultsDetails").hide();
                    let array = result['data'];
                    let listItem;
                    for (let i = 0; i < array.length; i++) {
                        listItem = '<li class="list-group-item" id="' + array[i]['id'] + '">'
                            + '<button type="button" class="fa-solid fa-user fa-xl fa-fw fa-border readButton"></button>'
                            + '<p>' + array[i]['firstName'] + ' ' + array[i]['lastName'] + '</p>'                           
                            + '</li>';
                        $("#allStaff").append(listItem);
                    };
                    readStaffClickHandler();
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
                        listItem = '<li class="list-group-item" id="' + array[i]['id'] + '">'
                            + '<button type="button" class="fa-solid fa-briefcase fa-xl fa-fw fa-border readButton"></button>'
                            + '<p>' + array[i]['name'] + '</p>'
                            + '</li>';
                        $("#allDepartments").append(listItem);
                    };
                    $("#allDepartments").show();
                    $("#departmentResultsDetails").show();
                    readDepartmentClickHandler();
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
                        listItem = '<li class="list-group-item" id="' + array[i]['id'] + '">' 
                            + '<button type="button" class="fa-solid fa-industry fa-xl fa-fw fa-border readButton"></button>'
                            + '<p>' + array[i]['name'] + '</p>'
                            + '</li>';
                        $("#allSites").append(listItem);
                    };
                    $("#allSites").show();
                    $("#siteResultsDetails").show();
                    readSiteClickHandler();
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
        departments = [];
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
                    populateDepartmentDropdown();                  
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
        sites = [];
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
                    populateSiteDropdown();
                };
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };

    //Filtered get staff function
    function getStaffFiltered(id1, id2) {
        $.ajax({
            url: "libraries/php/getStaffFiltered.php",
            type: "GET",
            data: {
                departmentID: id1,
                locationID: id2
            },
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {
                    $("#allStaff").empty();
                    let array = result['data'];
                    let listItem;
                    for (let i = 0; i < array.length; i++) {
                        listItem = '<li class="list-group-item" id="' + array[i]['id'] + '">' 
                            + '<button type="button" class="fa-solid fa-user fa-xl fa-fw fa-border readButton"></button>'
                            + '<p>' + array[i]['firstName'] + ' ' + array[i]['lastName'] + '</p>'
                            + '</li>';
                        $("#allStaff").append(listItem);
                    };
                    if (array.length === 0) {
                        listItem = '<li class="list-group-item">'
                            + '<p><i>Search returned no results.</i></p>'
                            + '</li>';
                        $("#allStaff").append(listItem);
                    };
                    readStaffClickHandler();
                };
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };

    //Filtered get departments function
    function getDepartmentsFiltered(id1) {
        $.ajax({
            url: "libraries/php/getDepartmentsFiltered.php",
            type: "GET",
            data: {
                locationID: id1
            },
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {
                    $("#allDepartments").empty();
                    let array = result['data'];
                    let listItem;
                    for (let i = 0; i < array.length; i++) {
                        listItem = '<li class="list-group-item" id="' + array[i]['id'] + '">' 
                            + '<button type="button" class="fa-solid fa-briefcase fa-xl fa-fw fa-border readButton"></button>'
                            + '<p>' + array[i]['name'] + '</p>'
                            + '</li>';
                        $("#allDepartments").append(listItem);
                    };
                    readDepartmentClickHandler();
                };
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };

    //Get staff by ID function
    function getStaffById(id1) {
        $.ajax({
            url: "libraries/php/getStaffById.php",
            type: "GET",
            data: {
                ID: id1
            },
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {
                    let array = result['data'];
                    $("#staffName").html(array[0]['firstName'] + " " + array[0]['lastName']);
                    $("#staffId").html(array[0]["id"]);
                    $("#staffEmail").html(array[0]["email"]);
                    $("#staffJob").html(array[0]["jobTitle"]);
                    $("#staffDepartment").html(array[0]["department"]);
                    $("#staffLocation").html(array[0]["location"]);
                    $('#readStaffModal').modal('show');
                };
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };

    //Get department by ID function
    function getDepartmentById(id1) {
        $.ajax({
            url: "libraries/php/getDepartmentById.php",
            type: "GET",
            data: {
                ID: id1
            },
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {
                    let array = result['data'];
                    $("#departmentName").html(array[0]["name"]);
                    $("#departmentId").html(array[0]["id"]);
                    $("#departmentLocation").html(array[0]["location"]);
                    $('#readDepartmentModal').modal('show');
                };
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };

    //Get site by ID function
    function getSiteById(id1) {
        $.ajax({
            url: "libraries/php/getSiteById.php",
            type: "GET",
            data: {
                ID: id1
            },
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {
                    let array = result['data'];
                    $("#siteId").html(array[0]["id"]);
                    $("#siteName").html(array[0]["name"]);
                    $('#readSiteModal').modal('show');
                };
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };

    //CreateStaff form submit
    $("#confirm1").click(function() {
        let proceed = confirm("Are you sure you wish to create this Employee?");
        if (proceed) {
            $.ajax({
                url: "libraries/php/insertStaff.php",
                type: "POST",
                data: $("#createStaffForm").serialize(),                    
                success: function(result) {
                    // console.log(JSON.stringify(result));
                    if (result.status.name == "ok") {
                        document.forms["createStaffForm"].reset();
                        getAllStaff();
                        $("#createStaffModal").modal("hide");
                        alert("New Employee added successfully!");
                    };
                },
                error: function(jqXHR, exception) {
                    let msg = "Uncaught Error.\n" + jqXHR.responseText;
                    console.log(msg);
                }
            });            
        } else {    
            document.forms["createStaffForm"].reset();
        };
    });

    //CreateDepartment form submit
    $("#confirm2").click(function() {
        let proceed = confirm("Are you sure you wish to create this Department?");
        if (proceed) {
            $.ajax({
                url: "libraries/php/insertDepartment.php",
                type: "POST",
                data: $("#createDepartmentForm").serialize(),                    
                success: function(result) {
                    // console.log(JSON.stringify(result));
                    if (result.status.name == "ok") {
                        document.forms["createDepartmentForm"].reset();
                        getAllDepartments();
                        getDepartmentNames();
                        $("#createDepartmentModal").modal("hide");
                        alert("New Department added successfully!");
                    };
                },
                error: function(jqXHR, exception) {
                    let msg = "Uncaught Error.\n" + jqXHR.responseText;
                    console.log(msg);
                }
            });            
        } else {    
            document.forms["createDepartmentForm"].reset();
        };
    });

    //CreateSite form submit
    $("#confirm3").click(function() {
        let proceed = confirm("Are you sure you wish to create this Site?");
        if (proceed) {
            $.ajax({
                url: "libraries/php/insertSite.php",
                type: "POST",
                data: $("#createSiteForm").serialize(),                    
                success: function(result) {
                    // console.log(JSON.stringify(result));
                    if (result.status.name == "ok") {
                        document.forms["createSiteForm"].reset();
                        getAllSites();
                        getSiteNames();
                        $("#createSiteModal").modal("hide");
                        alert("New Site added successfully!");
                    };
                },
                error: function(jqXHR, exception) {
                    let msg = "Uncaught Error.\n" + jqXHR.responseText;
                    console.log(msg);
                }
            });            
        } else {    
            document.forms["createSiteForm"].reset();
        };
    });


    //Click Handlers
    //Department modal click handler
    function addDeptModalClickHandlers() {
        $("#departmentSelectModalBody > div").each(function() {
            $(this).click(function() {
                let text = $(this).children('label').html();
                $(".depSelect").html(text);
                let department = departments.find(department => department.name === text);
                if (!department) {
                    departmentId = 0;
                } else {
                    departmentId = department.id;
                }                
                getStaffFiltered(departmentId, siteId);
            });
        });
    };

    //Site modal click handler
    function addSiteModalClickHandlers() {
        $("#siteSelectModalBody > div").each(function() {
            $(this).click(function() {
                let text = $(this).children('label').html();
                $(".siteSelect").html(text);
                let site = sites.find(site => site.name === text);
                if (!site) {
                    siteId = 0;
                } else {
                    siteId = site.id;
                };                
                if($("#departmentResultsDetails").css("display") === "none") {
                    getStaffFiltered(departmentId, siteId);
                } else {
                    getDepartmentsFiltered(siteId);
                };                
            });
        });
    };

    //readStaff button click handler
    function readStaffClickHandler() {
        $("#allStaff > li").each(function() {
            $(this).click(function() {
                let id = $(this).attr("id");
                // console.log(id);
                getStaffById(id);
            });            
        });
    };

    //readDepartment button click handler
    function readDepartmentClickHandler() {
        $("#allDepartments > li").each(function() {
            $(this).click(function() {
                let id = $(this).attr("id");
                // console.log(id);
                getDepartmentById(id);
            });
        });
    };

    //readSite button click handler
    function readSiteClickHandler() {
        $("#allSites > li").each(function() {
            $(this).click(function() {
                let id = $(this).attr("id");
                // console.log(id);
                getSiteById(id);
            });
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
    
    //provide department names to dropdown menu
    function populateDepartmentDropdown() {
        $("#createStaffDepartment").empty();
        let option;
        for (let i = 0; i < departments.length; i++) {
            option = '<option value="' + departments[i]["id"] + '">' + departments[i]["name"] + "</option>";
            $("#createStaffDepartment").append(option);
        };
    };

    //Provide site names to dropdown menu
    function populateSiteDropdown() {
        $("#createDepartmentSite").html("");
        let option;
        for (let i = 0; i < sites.length; i++) {
            option = '<option value="' + sites[i]["id"] + '">' + sites[i]["name"] + "</option>";
            $("#createDepartmentSite").append(option);
        };
    };

    

});
