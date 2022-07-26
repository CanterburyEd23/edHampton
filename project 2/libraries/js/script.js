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

    //Get all employees
    function getAllStaff() {
        $.ajax({
            url: "libraries/php/getAll.php",
            type: "GET",
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {
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
                        $("#allData").append(listItem);
                    };     
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
                if (result.status.name == "ok") {};
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
                if (result.status.name == "ok") {};
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };

    getAllStaff();
    getAllDepartments();
    getAllSites();

});