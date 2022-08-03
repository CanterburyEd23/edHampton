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
    let selectedId;


    //Initial API calls
    getAllStaff();
    getDepartmentNames();
    getSiteNames();


    //Main select buttons
    $("#allStaffButton").click(function(){
        getAllStaff();
        getDepartmentNames();
        getSiteNames();        
        $(".siteSelect").html('all Sites');
        departmentId = 0;
        siteId = 0;
    });

    $("#allDepartmentsButton").click(function(){
        getAllDepartments();
        getSiteNames(); 
        departmentId = 0;
        siteId = 0;
    });

    $("#allSitesButton").click(function(){
        getAllSites();
        departmentId = 0;
        siteId = 0;
    });
    

    // AJAX functions
    //Read and other GET functions
    //Get all employees
    function getAllStaff() {
        $.ajax({
            url: "libraries/php/getAllStaff.php",
            type: "GET",
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {
                    $("#allStaff").empty();
                    $("#allDepartments, #departmentResultsDetails, #allSites, #siteResultsDetails, #addDepartmentButton, #addSiteButton").hide();
                    let array = result['data'];
                    let listItem;
                    for (let i = 0; i < array.length; i++) {
                        listItem = '<li class="list-group-item" id="EMP' + array[i]['id'] + '">'
                            + '<button type="button" class="fa-solid fa-user fa-2xl fa-fw fa-border readButton"></button>'
                            + '<p class="staffInstance">' + array[i]['firstName'] + ' ' + array[i]['lastName'] + '</p>'                           
                            + '</li>';
                        $("#allStaff").append(listItem);
                    };
                    readStaffClickHandler();
                    $("#allStaff, #staffResultsDetails, #addStaffButton").show();
                    $('#staffInput').val('');
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
                    $("#allStaff, #staffResultsDetails, #allSites, #siteResultsDetails, #addStaffButton, #addSiteButton").hide();
                    let array = result['data'];
                    let listItem;
                    for (let i = 0; i < array.length; i++) {
                        listItem = '<li class="list-group-item" id="DEP' + array[i]['id'] + '">'
                            + '<button type="button" class="fa-solid fa-briefcase fa-2xl fa-fw fa-border readButton"></button>'
                            + '<p class="departmentInstance">' + array[i]['name'] + '</p>'
                            + '</li>';
                        $("#allDepartments").append(listItem);
                    };
                    $("#allDepartments, #departmentResultsDetails, #addDepartmentButton").show();
                    readDepartmentClickHandler();
                    $('#departmentInput').val('');
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
                    $("#allDepartments, #allStaff, #departmentResultsDetails, #staffResultsDetails, #addStaffButton, #addDepartmentButton").hide();                   
                    let array = result['data'];
                    let listItem;
                    for (let i = 0; i < array.length; i++) {
                        listItem = '<li class="list-group-item" id="LOC' + array[i]['id'] + '">' 
                            + '<button type="button" class="fa-solid fa-industry fa-2xl fa-fw fa-border readButton"></button>'
                            + '<p class="siteInstance">' + array[i]['name'] + '</p>'
                            + '</li>';
                        $("#allSites").append(listItem);
                    };
                    $("#allSites, #siteResultsDetails, #addSiteButton").show();
                    readSiteClickHandler();
                    $('#siteInput').val('');
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
                    populateDepartmentDropdown();
                    populateFilterDepDropdown();
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
                    populateSiteDropdown();
                    populateFilterSiteDropdown();
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
                        listItem = '<li class="list-group-item" id="EMP' + array[i]['id'] + '">' 
                            + '<button type="button" class="fa-solid fa-user fa-2xl fa-fw fa-border readButton"></button>'
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
                    $('#staffInput').val('');
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
                        listItem = '<li class="list-group-item" id="DEP' + array[i]['id'] + '">' 
                            + '<button type="button" class="fa-solid fa-briefcase fa-2xl fa-fw fa-border readButton"></button>'
                            + '<p>' + array[i]['name'] + '</p>'
                            + '</li>';
                        $("#allDepartments").append(listItem);
                    };
                    readDepartmentClickHandler();
                    $('#departmentInput').val('');
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
                console.log(JSON.stringify(result));
                if (result.status.name == "ok") {
                    let array = result['data'];
                    $("#staffName").html(array[0]['firstName'] + " " + array[0]['lastName']);
                    $("#editStaffFirstName").attr("value", array[0]['firstName']);
                    $("#editStaffLastName").attr("value", array[0]['lastName']);
                    $("#editStaffId").attr("value", array[0]['id']);
                    $("#staffEmail").html(array[0]["email"]);
                    $("#editStaffEmail").attr("value", array[0]['email']);
                    $("#staffJob").html(array[0]["jobTitle"]);
                    $("#editStaffJob").attr("value", array[0]['jobTitle']);
                    $("#staffDepartment").html(array[0]["department"]);                    
                    $("#staffLocation").html(array[0]["location"]);                    
                    $('#readStaffModal').modal('show');
                    selectedId = array[0]["id"];
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
                    selectedId = array[0]["id"];
                    $("#departmentName").html(array[0]["name"]);
                    $("#editDepartmentName").attr("value", array[0]["name"]);
                    $("#editDepartmentId").attr("value", array[0]["id"]);
                    $("#departmentLocation").html(array[0]["location"]);
                    departmentStaffNumberCheck();
                };
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };

    //Check Department for number of Employees
    function departmentStaffNumberCheck() {
        $.ajax({
            url: "libraries/php/deleteDepartmentStaffCheck.php",
            type: "GET",
            data: {
                ID: selectedId
            },
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {
                    let array = result['data'];
                    $("#departmentStaffNumber").html(array.length);
                    $('#readDepartmentModal').modal("show");
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
                    selectedId = array[0]["id"];
                    $("#editSiteId").attr("value", array[0]["id"]);
                    $("#siteName").html(array[0]["name"]);
                    $("#editSiteName").attr("value", array[0]["name"]);
                    siteDepartmentNumberCheck();
                };
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };

    //Check Site for number of Departments
    function siteDepartmentNumberCheck() {
        $.ajax({
            url: "libraries/php/deleteSiteDepartmentCheck.php",
            type: "GET",
            data: {
                ID: selectedId
            },
            success: function(result) {
                // console.log(JSON.stringify(result));                
                if (result.status.name == "ok") {
                    let array = result['data'];
                    $("#siteDepartmentNumber").html(array.length);
                    $('#readSiteModal').modal("show");
                };
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };


    //Create Functions
    //CreateStaff form submit
    $("#confirm1").click(function() {
        let validated = validateCreateStaffForm();
        if (validated === false) {
            return;
        };
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
        let validated = validateCreateDepartmentForm();
        if (validated === false) {
            return;
        };
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
        let validated = validateCreateSiteForm();
        if (validated === false) {
            return;
        };
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


    //Update Functions
    //EditStaff form submit
    $("#confirm4").click(function() {
        let validated = validateEditStaffForm();
        if (validated === false) {
            return;
        };
        let proceed = confirm("Are you sure you wish to update the details of this Employee?");
        if (proceed) {
            $.ajax({
                url: "libraries/php/updateStaff.php",
                type: "POST",
                data: $("#editStaffForm").serialize(),                    
                success: function(result) {
                    console.log(JSON.stringify(result));
                    if (result.status.name == "ok") {
                        document.forms["editStaffForm"].reset();
                        getAllStaff();
                        $("#editStaffModal").modal("hide");
                        alert("Employee details updated successfully!");
                    };
                },
                error: function(jqXHR, exception) {
                    let msg = "Uncaught Error.\n" + jqXHR.responseText;
                    console.log(msg);
                }
            });            
        } else {    
            document.forms["editStaffForm"].reset();
        };
    });

    //EditDepartment form submit
    $("#confirm5").click(function() {
        let validated = validateEditDepartmentForm();
        if (validated === false) {
            return;
        };
        let proceed = confirm("Are you sure you wish to update the details of this Department?");
        if (proceed) {
            $.ajax({
                url: "libraries/php/updateDepartment.php",
                type: "POST",
                data: $("#editDepartmentForm").serialize(),                    
                success: function(result) {
                    console.log(JSON.stringify(result));
                    if (result.status.name == "ok") {
                        document.forms["editDepartmentForm"].reset();
                        getAllDepartments();
                        getDepartmentNames();
                        $("#editDepartmentModal").modal("hide");
                        alert("Department details updated successfully!");
                    };
                },
                error: function(jqXHR, exception) {
                    let msg = "Uncaught Error.\n" + jqXHR.responseText;
                    console.log(msg);
                }
            });            
        } else {    
            document.forms["editDepartmentForm"].reset();
        };
    });

    //EditSite form submit
    $("#confirm6").click(function() {
        let validated = validateEditSiteForm();
        if (validated === false) {
            return;
        };
        let proceed = confirm("Are you sure you wish to update the details of this Site?");
        if (proceed) {
            $.ajax({
                url: "libraries/php/updateSite.php",
                type: "POST",
                data: $("#editSiteForm").serialize(),                    
                success: function(result) {
                    console.log(JSON.stringify(result));
                    if (result.status.name == "ok") {
                        document.forms["editSiteForm"].reset();
                        getAllSites();
                        getSiteNames();
                        $("#editSiteModal").modal("hide");
                        alert("Site details updated successfully!");
                    };
                },
                error: function(jqXHR, exception) {
                    let msg = "Uncaught Error.\n" + jqXHR.responseText;
                    console.log(msg);
                }
            });            
        } else {    
            document.forms["editSiteForm"].reset();
        };
    });


    //Delete Functions
    //Delete Staff by ID
    $("#confirm7").click(function() {
        let proceed = confirm("You are about to delete this Employee's records, are you sure?");
        if (proceed) {            
            $.ajax({
                url: "libraries/php/deleteStaffById.php",
                type: "POST",
                data: {
                    id: selectedId
                },    
                success: function(result) {
                    console.log(JSON.stringify(result));
                    if (result.status.name == "ok") {                        
                        getAllStaff();                        
                        alert("Employee details deleted");
                        $("#readStaffModal").modal("hide");
                    };
                },
                error: function(jqXHR, exception) {
                    let msg = "Uncaught Error.\n" + jqXHR.responseText;
                    console.log(msg);
                }
            });            
        };
    });

    //Delete Department Part 1
    //Delete Department button click
    $("#confirm8").click(function() {        
        deleteDepartmentStaffCheck();
    });

    //Delete Department Part 2
    //Check Department for Employees
    function deleteDepartmentStaffCheck() {
        $.ajax({
            url: "libraries/php/deleteDepartmentStaffCheck.php",
            type: "GET",
            data: {
                ID: selectedId
            },
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {
                    let array = result['data'];
                    if (array.length > 0) {
                        alert("Cannot delete a Department with Employees assigned to it!");
                        return;
                    } else {
                        let proceed = confirm("You are about to delete this Department, are you sure?");
                        if (proceed) {
                            deleteDepartment();
                        } else {
                            return;
                        };
                    };
                };
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };

    //Delete Department Part 3
    //Delete Department
    function deleteDepartment() {
        $.ajax({
            url: "libraries/php/deleteDepartmentById.php",
            type: "POST",
            data: {
                id: selectedId
            },    
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {                        
                    getAllDepartments();                        
                    alert("Department deleted");
                    $("#readDepartmentModal").modal("hide");
                };
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    }

    //Delete Site Part 1
    //Delete Site button click
    $("#confirm9").click(function() {
        deleteSiteDepartmentCheck();        
    });

    //Delete Site Part 2
    //Check Site for Departments
    function deleteSiteDepartmentCheck() {
        $.ajax({
            url: "libraries/php/deleteSiteDepartmentCheck.php",
            type: "GET",
            data: {
                ID: selectedId
            },
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {
                    let array = result['data'];
                    if (array.length > 0) {
                        alert("Cannot delete a Site with Departments assigned to it!");
                        return;
                    } else {
                        let proceed = confirm("You are about to delete this Site, are you sure?");
                        if (proceed) {
                            deleteSite();
                        } else {
                            return;
                        };
                    };
                };
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };

    //Delete Site Part 3
    //Delete Site
    function deleteSite() {
        $.ajax({
            url: "libraries/php/deleteSiteById.php",
            type: "POST",
            data: {
                id: selectedId
            },    
            success: function(result) {
                console.log(JSON.stringify(result));
                if (result.status.name == "ok") {                        
                    getAllSites();                        
                    alert("Site deleted");
                    $("#readSiteModal").modal("hide");
                };
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });            
    };  


    //Non-AJAX Functions
    //Click Handlers
    //staffDepSelect Filter Dropdown click handler
    function addStaffDepSelectClickHandler() {
        $("#staffDepSelect").click(function() {
            departmentId = $("#staffDepSelect").val();
            getStaffFiltered(departmentId, siteId);
        });
    };

    //staffSiteSelect click handler
    function addStaffSiteSelectClickHandler() {
        $("#staffSiteSelect").click(function() {
            siteId = $("#staffSiteSelect").val();
            getStaffFiltered(departmentId, siteId);
        });
    };

    //depSiteSelect click handler
    function addDepSiteSelectClickHandler() {
        $("#depSiteSelect").click(function() {
            siteId = $("#depSiteSelect").val();
            getDepartmentsFiltered(siteId);
        });
    };

    //readStaff button click handler
    function readStaffClickHandler() {
        $("#allStaff > li").each(function() {
            $(this).click(function() {
                let id = $(this).attr("id").slice(3);
                // console.log(id);
                getStaffById(id);
            });            
        });
    };

    //readDepartment button click handler
    function readDepartmentClickHandler() {
        $("#allDepartments > li").each(function() {
            $(this).click(function() {
                let id = $(this).attr("id").slice(3);
                // console.log(id);
                getDepartmentById(id);
            });
        });
    };

    //readSite button click handler
    function readSiteClickHandler() {
        $("#allSites > li").each(function() {
            $(this).click(function() {
                let id = $(this).attr("id").slice(3);
                // console.log(id);
                getSiteById(id);
            });
        });
    };


    //Form Validators
    //For all create and edit Staff, Department, and Site forms
    function validateCreateStaffForm() {        
        let firstName = $("#createStaffFirstName").val();
        let lastName = $("#createStaffLastName").val();
        let email = $("#createStaffEmail").val();
        let job = $("#createStaffJob").val();
        if(!checkName(firstName)) {
            return false;
        } else if (!checkName(lastName)) {
            return false;
        } else if (!checkEmail(email)) {
            return false;
        } else if (!checkJob(job)) {
            return false;
        } else {
            return true;
        };
    };

    function validateCreateDepartmentForm() {        
        let name = $("#createDepartmentName").val();        
        if(!checkName(name)) {
            return false;
        } else {
            return true;
        };
    };

    function validateCreateSiteForm() {        
        let name = $("#createSiteName").val();        
        if(!checkName(name)) {
            return false;
        } else {
            return true;
        };
    };

    function validateEditStaffForm() {        
        let firstName = $("#editStaffFirstName").val();
        let lastName = $("#editStaffLastName").val();
        let email = $("#editStaffEmail").val();
        let job = $("#editStaffJob").val();
        if(!checkName(firstName)) {
            return false;
        } else if (!checkName(lastName)) {
            return false;
        } else if (!checkEmail(email)) {
            return false;
        } else if (!checkJob(job)) {
            return false;
        } else {
            return true;
        };
    };

    function validateEditDepartmentForm() {        
        let name = $("#editDepartmentName").val();        
        if(!checkName(name)) {
            return false;
        } else {
            return true;
        };
    };

    function validateEditSiteForm() {        
        let name = $("#editSiteName").val();        
        if(!checkName(name)) {
            return false;
        } else {
            return true;
        };
    };

    
    //Validation Functions
    //Component functions of all Form Validation Functions
    const isRequired = value => value === '' ? false : true;

    const isBetween = (length, min, max) => length < min || length > max ? false : true;

    const isEmailValid = (email) => {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    };

    const charactersCheck = (value) => {
        const characters = /[^a-zA-Z0-9 ]/g;
        return !value.match(characters);
    };

    const checkName = (name) => {
        let valid = false;
        const min = 2;
        const max = 30;
        const formName = name;
        if(!isRequired(formName)) {
            alert(`Name cannot be blank.`);
        } else if (!isBetween(formName.length, min, max)) {
            alert(`Names must be between ${min} and ${max} characters.`);
        } else if (!charactersCheck(formName)) {
            alert("Names cannot contain special characters.")
        } else {
            valid = true;
        };
        return valid;
    };

    const checkEmail = (email) => {
        let valid = false;
        let formEmail = email;
        if(!isRequired(formEmail)) {
            alert("Email cannot be blank.");
        } else if(!isEmailValid(formEmail)) {
            alert("Email address is not valid");
        } else {
            valid = true;
        };
        return valid;
    };

    const checkJob = (job) => {
        let valid = false;
        let formJob = job;
        if(!charactersCheck(job)) {
            alert("Job Titles cannot contain special characters.");
        } else {
            valid = true;
        };
        return valid;
    };
    
    
    //Misc. Functions
    //provide department names to dropdown menu
    function populateDepartmentDropdown() {
        $("#createStaffDepartment").empty();
        $("#editStaffDepartment").empty();
        let option;
        for (let i = 0; i < departments.length; i++) {
            option = '<option value="' + departments[i]["id"] + '">' + departments[i]["name"] + "</option>";
            $("#createStaffDepartment").append(option);
            $("#editStaffDepartment").append(option);
        };        
    };

    //provide department names to filter dropdown
    function populateFilterDepDropdown() {        
        $(".depSelect").empty();
        let option = '<option value="0">All Departments</option>';
        $(".depSelect").append(option);
        for (let i = 0; i < departments.length; i++) {
            option = '<option value="' + departments[i]["id"] + '">' + departments[i]["name"] + "</option>";            
            $(".depSelect").append(option);
        };
        addStaffDepSelectClickHandler();
    };

    //Provide site names to dropdown menu
    function populateSiteDropdown() {
        $("#createDepartmentSite").empty();
        $("#editDepartmentSite").empty();
        let option;
        for (let i = 0; i < sites.length; i++) {
            option = '<option value="' + sites[i]["id"] + '">' + sites[i]["name"] + "</option>";
            $("#createDepartmentSite").append(option);
            $("#editDepartmentSite").append(option);
        };        
    };

    //provide site names to filter dropdown
    function populateFilterSiteDropdown() {        
        $("#staffSiteSelect").empty();
        $("#depSiteSelect").empty();
        let option = '<option value="0">All Locations</option>';
        $("#staffSiteSelect").append(option);
        $("#depSiteSelect").append(option);
        for (let i = 0; i < sites.length; i++) {
            option = '<option value="' + sites[i]["id"] + '">' + sites[i]["name"] + "</option>";            
            $("#staffSiteSelect").append(option);
            $("#depSiteSelect").append(option);
        };
        addStaffSiteSelectClickHandler();
        addDepSiteSelectClickHandler();       
    };

    //Listener for the staffInput textbox
    $("#staffInput").keyup(function() {
        filterStaffList();
    });

    //Filter triggered by the staffInput textbox
    function filterStaffList() {        
        let txtValue;
        let input = $('#staffInput');
        let filter = input.val().toUpperCase();
        let list = $("#allStaff");
        let listItem = list.children();
        let p;      
        for (let i = 0; i < listItem.length; i++) {
            p = listItem[i].getElementsByTagName("p")[0];
            txtValue = p.textContent || p.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                listItem[i].style.display = "";
            } else {
                listItem[i].style.display = "none";
            };
        };
    };

    //Listener for the departmentInput textbox
    $("#departmentInput").keyup(function() {
        filterDepartmentList();
    });

    //Filter triggered by the departmentInput textbox
    function filterDepartmentList() {        
        let txtValue;
        let input = $('#departmentInput');
        let filter = input.val().toUpperCase();
        let list = $("#allDepartments");
        let listItem = list.children();
        let p;      
        for (let i = 0; i < listItem.length; i++) {
            p = listItem[i].getElementsByTagName("p")[0];
            txtValue = p.textContent || p.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                listItem[i].style.display = "";
            } else {
                listItem[i].style.display = "none";
            };
        };
    };

    //Listener for the siteInput textbox
    $("#siteInput").keyup(function() {
        filterSiteList();
    });

    //Filter triggered by the siteInput textbox
    function filterSiteList() {        
        let txtValue;
        let input = $('#siteInput');
        let filter = input.val().toUpperCase();
        let list = $("#allSites");
        let listItem = list.children();
        let p;      
        for (let i = 0; i < listItem.length; i++) {
            p = listItem[i].getElementsByTagName("p")[0];
            txtValue = p.textContent || p.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                listItem[i].style.display = "";
            } else {
                listItem[i].style.display = "none";
            };
        };
    };    

});
