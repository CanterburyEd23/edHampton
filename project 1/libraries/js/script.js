// Step 4: Task - Primary script file

const apiKey = '05b5574976782477ccf8ab24bedc1f41';  //openWeather API

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
    let countryCurrency;
    let countryExchangeRate;    
    let countryWiki;
    
    let capitalLat;
    let capitalLon;
    
    let weatherMain;
    let weatherDetail;
    let weatherTemp;
    let weatherHumidity;
    let weatherWind;

    

    //Update Infobox Function
    function updateInfo() {
        document.getElementById("countryName").innerText = countryName;
        document.getElementById("countryCapital").innerText = countryCapital;
        document.getElementById("countryPopulation").innerText = countryPopulation;       
        document.getElementById("countryCurrency").innerText = countryCurrency;
        document.getElementById("countryExchangeRate").innerText = countryExchangeRate;        
        document.getElementById("countryWiki").innerText = countryWiki;
    };    

    //Update Weatherbox Function
    function updateWeather() {
        document.getElementById("weatherMain").innerText = weatherMain;
        document.getElementById("weatherDetail").innerText = weatherDetail;
        document.getElementById("weatherTemp").innerText = weatherTemp;
        document.getElementById("weatherHumidity").innerText = weatherHumidity;
        document.getElementById("weatherWind").innerText = weatherWind;
    };

    //currently sets all the values to undefined on page load
    updateInfo();
    updateWeather();


    //Function that provides the country list and codes to the "Select Country" dropdown menu
    function get_country_codes() {
        $.ajax({
            url: "libraries/php/getCountryCodes.php?",
            type: "GET",
            success: function (json) {
                // console.log(json);
                let countries = JSON.parse(json);
                let option = "";
                for (country of countries) {
                    option += '<option value="' + country[1] + '">' + country[0] + "</option>";
                }
                $("#country_list").append(option);            
            },               
        });
    };

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
                ISO2Code: iso2
            },
            success: function(result) {
                // console.log(JSON.stringify(result));  //Log the response to console
                if (result.status.name == "ok") {
                    countryName = result['data'][0]['countryName'];
                    countryCapital = result['data'][0]['capital'];
                    countryPopulation = result['data'][0]['population'];
                    countryCurrency = result['data'][0]['currencyCode'];
                    getLatLon(countryCapital, apiKey);  //Uses the Capital City name to get co-ordinates, which in turn get the weather for that city
                    updateInfo();  //Updates the Country Info box with all the new information
                }
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };    

    //get Capital City Coordinates function
    function getLatLon(city, apiKey) {
        $.ajax({
            url: "libraries/php/getLatLon.php",
            type: "POST",
            dataType: "json",
            data: {
                CityName: city,
                APIKey: apiKey
            },
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {  
                    capitalLat = result['data'][0]['lat'];
                    capitalLon = result['data'][0]['lon']; 
                    getWeather(capitalLat, capitalLon, apiKey);  //Uses the acquired coordinates to fetch the weather forecast for the capital
                }
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };

    //get Weather in Capital City function
    function getWeather(lat, lon, apiKey) {
        $.ajax({
            url: "libraries/php/getWeather.php",
            type: "POST",
            dataType: "json",
            data: {
                Lat: lat,
                Lon: lon,
                APIKey: apiKey
            },
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {  
                    weatherMain = result['data']['weather'][0]['main'];
                    weatherDetail = result['data']['weather'][0]['description'];
                    weatherTemp = result['data']['main']['temp'];
                    weatherHumidity = result['data']['main']['humidity'];
                    weatherWind = result['data']['wind']['speed'];
                    updateWeather();  //Sets all the weather data in state, then with this function, updates the weatherinfo box
                }
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };



});
