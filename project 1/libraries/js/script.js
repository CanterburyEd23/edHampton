// Gazetter App - Primary script file

//Api Keys
const apiKey = '05b5574976782477ccf8ab24bedc1f41';  //openWeather API
const apiKey2 = '7868d543588241e4a13c9b7845e65aa2';  //openExchangeRates API

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

    //Initiating the Map
    let map = L.map('map').setView([50, 0], 3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
        
    //State    
    //Device Location info
    let deviceLat;
    let deviceLon;
    let deviceCountryCode;
    
    //Country Info Modal
    let countryCode;
    let countryName;    
    let countryCapital;
    let countryPopulation;
    let countryCurrency;
    let countryCurrencyName;
    let countryExchangeRate;
    let countryFlag;  
    let countryWiki = 'https://en.wikipedia.org/wiki/';
    
    //Capital Location for Weather API Call
    let capitalLat;
    let capitalLon;
    
    //Weather Info Modal
    let weatherMain;
    let weatherDetail;
    let weatherTemp;
    let weatherHumidity;
    let weatherWind;

    //Country Outline Overlay
    let countryOutline = new L.geoJson().addTo(map);

    //Map Markers
    let youAreHere;
    let capitalMarker;
    

    get_country_codes();
    getLocation();


    //Modal Updating Functions
    //Update Infobox Function
    function updateInfo() {
        document.getElementById("countryName").innerText = countryName;
        document.getElementById("countryCapital").innerText = countryCapital;
        document.getElementById("countryPopulation").innerText = countryPopulation;       
        document.getElementById("countryCurrencyName").innerText = countryCurrencyName;
        document.getElementById("countryExchangeRate").innerText = countryExchangeRate;
        let flag = document.getElementById("countryFlag");
        flag.src = countryFlag;       
        let a = document.getElementById("countryWiki");
        a.href = countryWiki;        
    };    

    //Update Weatherbox Function
    function updateWeather() {
        document.getElementById("weatherMain").innerText = weatherMain;
        document.getElementById("weatherDetail").innerText = weatherDetail;
        document.getElementById("weatherTemp").innerText = weatherTemp;
        document.getElementById("weatherHumidity").innerText = weatherHumidity;
        document.getElementById("weatherWind").innerText = weatherWind;
    };


    //Device Location Functions
    //Get current position function
    function getLocation() {
        if (navigator.geolocation) {  //if HTML5 Geolocation is supported...
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    };
    
    //get coordinates of current position function
    function showPosition(position) {  //Saves the device's coordinates
        deviceLat = position.coords.latitude;
        deviceLon = position.coords.longitude;
        youAreHere = L.marker([deviceLat, deviceLon]).addTo(map); //Adds the "you are here" marker to the map
        youAreHere.bindPopup("You are here").openPopup();
        getDeviceCountry(deviceLat, deviceLon);
    };  

    //get country code for position of current coordinates function
    function getDeviceCountry(lat, lon) {
        $.ajax({
            url: "libraries/php/getDeviceCountry.php",
            type: "POST",
            dataType: "json",
            data: {
                Lat: lat,
                Lon: lon
            },
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {
                    deviceCountryCode = result['data']['countryCode'];
                    getCountryOutline();
                    getCountryInfo();                                       
                }
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };

    
    //The "Select Country" dropdown menu
    //Dropdown menu selection - Event Listener
    document.getElementById("country_list").addEventListener('change', function(){
        countryCode = this.value;  //Sets the countryCode from the user's selection        
        getCountryInfo(countryCode);
        getCountryOutline(countryCode);
    });

    //Function that provides the country list and ISO codes to the dropdown menu
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


    //Various AJAX functions
    //Get coordinates from the json file to create the country highlight overlay on the map
    function getCountryOutline(iso2 = deviceCountryCode) {
        $.ajax({
            url: "libraries/php/getCountryOutline.php?",            
            type: "GET",            
            data: {
                Country: iso2
            },
            success: function (json) {
                // console.log(json)                
                data = JSON.parse(json);
                countryOutline.clearLayers();
                countryOutline.addData(data);
                countryOutline.setStyle(polystyle());
                const border = countryOutline.getBounds();
                map.fitBounds(border);                
            },               
        });
    };    

    //get Country Info function
    function getCountryInfo(iso2 = deviceCountryCode) {
        $.ajax({
            url: "libraries/php/getCountryInfo.php",
            type: "POST",
            dataType: "json",
            data: {
                ISO2Code: iso2
            },
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {
                    countryName = result['data'][0]['countryName'];
                    countryCapital = result['data'][0]['capital'];
                    countryPopulation = result['data'][0]['population'];
                    countryCurrency = result['data'][0]['currencyCode'];
                    countryFlag = 'https://countryflagsapi.com/png/' + iso2;
                    getLatLon(countryCapital);  //Uses the Capital City name to get co-ordinates, which in turn get the weather for that city
                    getExchangeRates();
                    getCurrencyName();
                    countryWiki = 'https://en.wikipedia.org/wiki/' + countryName;
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
    function getLatLon(city = countryCapital) {
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
                    capitalMarker = L.marker([capitalLat, capitalLon]).addTo(map); //Adds the capital city marker to the map
                    capitalMarker.bindPopup(`${countryName} capital: ${city}`);
                    getWeather(capitalLat, capitalLon, apiKey);  //Uses the acquired coordinates to fetch the weather forecast for the capital                    
                }
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };

    //get weather in capital city function
    function getWeather(lat = capitalLat, lon = capitalLon) {
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
                    weatherHumidity = result['data']['main']['humidity'];
                    weatherWind = result['data']['wind']['speed'];
                    toCelsius(result['data']['main']['temp'])
                    updateWeather();  //Sets all the weather data in state, then with this function, updates the weatherinfo box
                }
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };

    //get exchange rates function
    function getExchangeRates() {
        $.ajax({
            url: "libraries/php/getExchangeRate.php",
            type: "POST",
            dataType: "json",
            data: {                
                APIKey: apiKey2
            },
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {  
                    countryExchangeRate = result['data']['rates'][countryCurrency];
                    updateInfo();
                }
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };

    //get name of currency from currency code function
    function getCurrencyName() {
        $.ajax({
            url: "libraries/php/getCurrencyName.php",
            type: "POST",
            dataType: "json",
            data: {                
                APIKey: apiKey2
            },
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {  
                    countryCurrencyName = result['data'][countryCurrency];
                    updateInfo();
                }
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };

    
    //Other Miscellaneous Functions
    //Style setting for the JS polystyle function
    function polystyle() {
        return {
            fillColor: "RGB(50,140,70)",
            weight: 1,
            opacity: 0.0,
            color: "white", //Outline color
            fillOpacity: 0.5,
        };
    };

    //Fahrenheit to Celsius temperature convertor function
    function toCelsius(temp) {
        let celsius = (temp - 32) * (5/9);
        weatherTemp = celsius.toFixed(1);
    };

});
