// Step 4: Task - Primary script file

//preloader function
$(window).on('load', function () {
    if ($('#preloader').length) {
        $('#preloader').delay(1000).fadeOut('slow', function () {
            $(this).remove();
        });
    }
});

$(document).ready(function() {

    //State
    let countryCode;
    let countryName;    
    let countryCapital;
    let countryPopulation;
    let countryHeadOfState;
    let countryCurrency;
    let countryExchangeRate;
    let countryWeather ;
    let countryWiki;

    //setState
    function updateInfo() {
        document.getElementById("countryName").innerText = countryName;
        document.getElementById("countryCapital").innerText = countryCapital;
        document.getElementById("countryPopulation").innerText = countryPopulation;
        document.getElementById("countryHeadOfState").innerText = countryHeadOfState;
        document.getElementById("countryCurrency").innerText = countryCurrency;
        document.getElementById("countryExchangeRate").innerText = countryExchangeRate;
        document.getElementById("countryWeather").innerText = countryWeather;
        document.getElementById("countryWiki").innerText = countryWiki;
    }

    updateInfo();


    //Function that provides the country list and codes to the "Select Country" dropdown menu
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
    
    //Dropdown menu selection - Event Listener
    document.getElementById("country_list").addEventListener('change', function(){
        countryCode = this.value;  //Sets the countryCode from the user's selection
        console.log("You selected: ", countryCode);
        getCountryInfo(countryCode);  //Uses the code in subsequent api calls... 
    });


    //get Country Info function
    function getCountryInfo(iso2) {
        $.ajax({  //Constructing the api call...
            url: "libraries/php/getCountryInfo.php",
            type: "POST",
            dataType: "json",
            data: { //loading the required parameters into the api call...
                ISO2Code: iso2, 
            },
            success: function(result) {
                console.log(JSON.stringify(result));  //Log the response to console
                if (result.status.name == "ok") {  //If api returns results as expected, updates State accordingly
                    countryName = result['data'][0]['countryName'];
                    countryCapital = result['data'][0]['capital'];
                    countryPopulation = result['data'][0]['population'];
                    countryCurrency = result['data'][0]['currencyCode'];
                    updateInfo();  //Updates the Country Info box with all the new information
                }
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };

    



});
