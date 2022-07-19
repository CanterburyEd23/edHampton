// Gazetter App - Primary script file

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
    let myMap = L.map('map').setView([50, 0], 3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(myMap);

    wikiLinkMarkers = new L.FeatureGroup();
    myMap.addLayer(wikiLinkMarkers);
        
    //State    
    //Device Location info
    let deviceLat;
    let deviceLon;
    let deviceCountryCode;
    
    //Country Info Modal
    let countryCode;
    let countryName;
    let countryContinent;   
    let countryCapital;
    let countryPopulation;    
    let countryFlag;    

    //Currency Modal
    let countryCurrency;
    let countryCurrencyName;
    let countryExchangeRate;
    let currencyText;
    
    //Weather Info Modal
    let capitalLat;
    let capitalLon;

    //Wiki link, country outline, and markers
    let countryOutline = new L.geoJson().addTo(myMap);
    let countryWiki = 'https://en.wikipedia.org/wiki/';
    let youAreHere;
    let capitalMarker;
    

    get_country_codes();
    getLocation();


    //Modal Updating Functions
    //Update Infobox Function
    function updateInfo() {
        document.getElementById("countryName").innerText = countryName;
        document.getElementById("countryCapital").innerText = countryCapital;
        document.getElementById("countryContinent").innerText = countryContinent;
        document.getElementById("countryPopulation").innerText = countryPopulation;       
        document.getElementById("countryCurrencyName").innerText = countryCurrencyName;
        document.getElementById("countryExchangeRate").innerText = countryExchangeRate;
        document.getElementById("currencyText").innerHTML = currencyText;
        let flag = document.getElementById("countryFlag");
        flag.src = countryFlag;
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
        let customMarker = L.ExtraMarkers.icon({
            icon: "fa-person",
            markerColor: "red",
            shape: "star",
            prefix: "fa",
        });
        youAreHere = L.marker([deviceLat, deviceLon], { icon: customMarker }).addTo(myMap); //Adds the "you are here" marker to the map
        youAreHere.bindPopup("You are here").openPopup();
        getDeviceCountry(deviceLat, deviceLon);
    };  

    //get country code for position of current coordinates function
    function getDeviceCountry(lat, lon) {
        $.ajax({
            url: "libraries/php/getDeviceCountry.php",
            type: "GET",
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
                myMap.fitBounds(border);
                //TEST
                const north = border.getNorth();
                const east = border.getEast();
                const south = border.getSouth();
                const west = border.getWest();
                get_nearby_wikipedia(east, west, north, south);               
            },               
        });
    };    

    //get Country Info function
    function getCountryInfo(iso2 = deviceCountryCode) {
        $.ajax({
            url: "libraries/php/getCountryInfo.php",
            type: "GET",            
            data: {
                ISO2Code: iso2
            },
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {
                    countryName = result['data'][0]['countryName'];
                    countryCapital = result['data'][0]['capital'];
                    countryContinent = result['data'][0]['continentName'];
                    countryPopulation = result['data'][0]['population'];
                    countryCurrency = result['data'][0]['currencyCode'];
                    countryFlag = 'https://countryflagsapi.com/png/' + iso2;
                    getLatLon(countryCapital);  //Uses the Capital City name to get co-ordinates, which in turn get the weather for that city                    
                    getExchangeRates();                    
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
            type: "GET",            
            data: {
                CityName: city
            },
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {  
                    capitalLat = result['data'][0]['lat'];
                    capitalLon = result['data'][0]['lon'];
                    let customMarker = L.ExtraMarkers.icon({
                        icon: "fa-star",
                        markerColor: "green-dark",
                        shape: "square",
                        prefix: "fa",
                    });
                    capitalMarker = L.marker([capitalLat, capitalLon], { icon: customMarker }).addTo(myMap); //Adds the capital city marker to the map                    
                    capitalMarker.bindPopup(`${countryName} capital: ${city}`);
                    getWeather(capitalLat, capitalLon);  //Uses the acquired coordinates to fetch the weather forecast for the capital                    
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
            type: "GET",
            data: {
                Lat: lat,
                Lon: lon
            },
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {                    
                    for(let i = 0; i < 5; i++) {
                        let data = [{
                            weatherDate: timestampToDate(result['data']['daily'][i]['dt']),
                            weatherOutlook: result['data']['daily'][i]['weather']['0']['main'],
                            weatherHigh: toCelsius(result['data']['daily'][i]['temp']['max']),
                            weatherLow: toCelsius(result['data']['daily'][i]['temp']['min']),
                            weatherHumidity: result['data']['daily'][i]['humidity'],
                            weatherWindspeed: result['data']['daily'][i]['wind_speed']
                        }];       
                        let table = 'weatherTable';
                        populateTable(table, data);
                    };
                    // toCelsius(result['data']['current']['temp'])
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
            type: "GET",
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {  
                    countryExchangeRate = result['data']['rates'][countryCurrency].toFixed(2);
                    getCurrencyName();
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
            type: "GET",            
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {  
                    countryCurrencyName = result['data'][countryCurrency];
                    currencyText = `1 U.S. Dollar is worth ${countryExchangeRate} ${countryCurrencyName}.`
                    updateInfo();
                }
            },
            error: function(jqXHR, exception) {
                let msg = "Uncaught Error.\n" + jqXHR.responseText;
                console.log(msg);
            }
        });
    };

    //get random bunch of wiki links function
    function get_nearby_wikipedia(east, west, north, south) {
        wikiLinkMarkers.clearLayers();        
        $.ajax({
            url: "libraries/php/getNearbyWiki.php",
            type: "GET",
            data: {
                North: north,
                East: east,
                South: south,
                West: west
            },
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.status.name == "ok") {
                    let wikiLinks = result['data']['geonames'];
                    const wiki_icon = L.ExtraMarkers.icon({
                        icon: "fa-info",
                        markerColor: "green-light",
                        shape: "circle",
                        prefix: "fa",
                    });
                    for (let i = 0; i < wikiLinks.length; i++) {  //for each wiki entry in the array, create a custom marker...                            
                        const marker = L.marker([wikiLinks[i].lat, wikiLinks[i].lng], {
                            icon: wiki_icon,
                        }).bindPopup("<b>" + wikiLinks[i].title + "</b><br><a href='https://" + wikiLinks[i].wikipediaUrl + "'>Wikipedia Link</a>");
                        wikiLinkMarkers.addLayer(marker);                                                
                    };
                };
            },
        });
    };

    
    //Other Misc. Functions
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
        return weatherTemp;
    };

    //Populate the weather table function
    function populateTable(table, items) {
        let HTMLtable = document.getElementById(table);
        let row = HTMLtable.insertRow();
        items.forEach( item => {          
            let date = row.insertCell(0);
            date.innerHTML = item.weatherDate;
            let outlook = row.insertCell(1);
            outlook.innerHTML = item.weatherOutlook;
            let high = row.insertCell(2);
            high.innerHTML = item.weatherHigh;
            let low = row.insertCell(3);
            low.innerHTML = item.weatherLow;
            let humidity = row.insertCell(4);
            humidity.innerHTML = item.weatherHumidity + "%";
            let wind = row.insertCell(5);
            wind.innerHTML = item.weatherWindspeed + "mph";
        });
    };

    //Timestamp handling function
    function timestampToDate(timestamp) {
        const UNIXtimestamp = timestamp;
        const milliseconds = UNIXtimestamp * 1000;
        const dateObject = new Date(milliseconds);
        const readableDate = dateObject.toLocaleString("en-UK", {weekday: "short", day: "numeric", month: "short"});
        return readableDate;
    };


    //easyButtons
    //Country Info
    L.easyButton('fa-info-circle', function() {
        $('#infoModal').modal('show');
    }).addTo(myMap);
    //Currency Info
    L.easyButton('fa-gbp', function(){
        $('#currencyModal').modal('show');
    }).addTo(myMap);
    //Weather Info
    L.easyButton('fa-cloud-sun', function(){
        $('#weatherModal').modal('show');
    }).addTo(myMap);
    //Wiki Link
    L.easyButton('fa-wikipedia-w', function(){
        if (window.confirm(`This will leave this site and take you to ${countryName}'s Wikipedia page.  Are you sure?`)) {
            window.location.href=countryWiki;
        };
    }).addTo(myMap);
    //About
    L.easyButton('fa-question', function(){
        $('#aboutModal').modal('show');
    }).addTo(myMap);

});
