// Step 4: Task - Primary script file

//preloader function
$(window).on('load', function () {
    if ($('#preloader').length) {
        $('#preloader').delay(1000).fadeOut('slow', function () {
            $(this).remove();
        });
    }
});


//Get Country Codes
function get_country_codes() {
    $.ajax({
        url: "libraries/php/getCountryCodes.php?",
        type: "GET",
        success: function (json) {
            console.log(json);
            let countries = JSON.parse(json);
            let option = "";
            for (country of countries) {
                option += '<option value="' + country[1] + '">' + country[0] + "</option>";
            }
            $("#country_list").append(option);            
        },               
    });
}

get_country_codes();
