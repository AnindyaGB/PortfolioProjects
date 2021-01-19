////////////////////////////////////////////////////////////////////
 
var mymap = L.map('map');

     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);

/////////////////////////////////////////////////////////////////////
//setting up geojson layers    
var marker = null;
    var myLinesLayer = null;
    var airports = null;
var airportCluster = null;

function everything(){
    
    $.ajax({ //retrieve country borders from geoJSON file
    
        url: "libs/php/countryBorders.php",
        type: 'GET',
        dataType: 'json',
        
        success: function(result) {
                   
        if (result.status.name == "ok") {
            for(var i = 0; i < result['data'].length; i++){

                if(result['data'][i]['properties']['iso_a2'] == document.getElementById("locality-dropdown").value){
                    geojson = {"type":"FeatureCollection","features": [{"type":"Feature","properties":result['data'][i]['properties'],"geometry":result['data'][i]['geometry']}]};
                   
                }
            }

                if (myLinesLayer !== null) {
                mymap.removeLayer(myLinesLayer);
            }
            
           myLinesLayer = L.geoJSON(geojson,{})
           myLinesLayer.addTo(mymap); 
           mymap.fitBounds(myLinesLayer.getBounds())
           
        }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(errorThrown)
        } 
        
            })
        
             $.ajax({
                
                url: "libs/php/forwardGeocode.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    
                    country: document.getElementById("locality-dropdown").value
                    
                },
                success: function(result) {
                    
                    //console.log(result);
                        
                    if (result.status.name == "ok") {
    
                       // console.log(result['data'][0]['geometry']['lat']);
                        //console.log(result['data'][0]['geometry']['lng']);
                        lat = result['data'][0]['geometry']['lat']
                        lng = result['data'][0]['geometry']['lng']
                        //$('#countryName').html(document.getElementById("locality-dropdown").value)
                        //$('#coordinates').html(lat);
                        //mymap.setView([lat, lng], 6)
                        
                        //let geoJSON = {}
    
                       

                        
                    
    
                       //calls covid API. 
                       $.ajax({
                                   
                        url: "libs/php/covid.php",
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            countryCode: document.getElementById("locality-dropdown").value
                        },
                        success: function(result) {
                            
                            if (result.status.name == "ok") {
                                
                                var last = result['data'].length - 1
                                $('#lineChart').remove();
                                $('#graph-container').append('<canvas id="lineChart"><canvas>');

                                var confirmedCov = []
                                var dateCov = []
                                var deathsCov = []
                                var recoveredCov = []
                                for(var i = 0; i < result['data'].length; i++) {
                                    
                                    confirmedCov.push(result['data'][i]['Confirmed']);
                                    dateCov.push((result['data'][i]['Date']).substr(0,10));
                                    deathsCov.push(result['data'][i]['Deaths']);
                                    recoveredCov.push(result['data'][i]['Recovered']);
                                   // dateCov.push(result['data'][i]['Date']);
                                    }
                                
                                $('#covidConfirmed').html(result['data'][last]['Confirmed']);
                                $('#covidDeaths').html(result['data'][last]['Deaths']);
                                $('#covidRecovered').html(result['data'][last]['Recovered']);

                                var ctxL = document.getElementById("lineChart").getContext('2d');
                                var myLineChart = new Chart(ctxL, {
                                    type: 'line',
                                    data: {
                                    labels: dateCov,
                                    datasets: [{
                                    label: "Confirmed Cases",
                                    data: confirmedCov,
                                    backgroundColor: [
                                    'rgba(105, 0, 132, .2)',
                                    ],
                                    borderColor: [
                                    'rgba(200, 99, 132, .7)',
                                    ],
                                    borderWidth: 1
                                    },
                                    {
                                    label: "Deaths",
                                    data: deathsCov,
                                    backgroundColor: [
                                    'rgba(0, 137, 132, .2)',
                                    ],
                                    borderColor: [
                                    'rgba(0, 10, 130, .7)',
                                    ],
                                    borderWidth: 1
                                    },
                                    {
                                    label: "Recovered",
                                    data: recoveredCov,
                                    backgroundColor: [
                                    'rgba(132, 137, 0, .2)',
                                    ],
                                    borderColor: [
                                    'rgba(130, 10, 0, .7)',
                                    ],
                                    borderWidth: 1
                                    }
                                    ]
                                    },
                                    options: {
                                    responsive: true
                                    }
                                    });
                            }
                            
                           
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            // your error code
                            
                            console.log(errorThrown)
    
                        } 
    
                        
                    });
    
                    //Calls Rest API
                       $.ajax({
                                    
                        url: "libs/php/rest.php",
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            country: document.getElementById("locality-dropdown").value
                        },
                        success: function(result) {
                            
                            if (result.status.name == "ok") {
                                //applies info to HTML
                                var name = result['data']['name']
                                $('#countryName').html(name);
                                var capital = result['data']['capital']
                                $('#txtcapital').html(capital);
                                
                                $('#txtpopulation').html(result['data']['population']);
                                $('#txtcurrency').html(result['data']['currencies'][0]['name']);
                                var code = result['data']['currencies'][0]['code'];
                                $('#txtcurrencyCode').html(code);
                                var flag = result['data']['flag']
                                document.getElementById("flag").src = result['data']['flag'];
                                $('#Language').html(result['data']['languages'][0]["name"]);
                                $('#continent').html(result['data']['subregion']);
                                $('#currencySymbol').html(result['data']['currencies'][0]['symbol']);
                                var naitiveName = result['data']['nativeName']
                                $('#naitiveName').html(naitiveName);
                                var bordersArray = result['data']['borders']
                                var borders = ""

                                for(var z=0; z<bordersArray.length; z++){
                                    borders += bordersArray[z] + ", "
                                }
                                $('#timeZone').html(borders);

                                var jointCapital = capital.replace(/\s/g, "%20").replace(/,/g, "%2C%") //turns countries with two names into 1 name
                                //getting cooridinates of capital city and placing icon 
                                $.ajax({ 
            
                                    url: "libs/php/forwardGeocode.php",
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                        country: jointCapital
                                    },
                                    success: function(result) {
                                               
                                    if (result.status.name == "ok") {
                                        latCapital = result['data'][0]['geometry']['lat']
                                        lngCapital = result['data'][0]['geometry']['lng']
                                       // console.log(latCapital + "" + lngCapital);
                                        
                                        if (marker !== null) {
                                            mymap.removeLayer(marker);
                                        }
               
                                        marker = L.marker([latCapital, lngCapital], {icon: L.icon.glyph({ prefix: 'fas', glyph: 'city' })}).addTo(mymap);
                                        marker.bindPopup("Capital City: " + capital)
                                    }
                                    
                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                        // your error code
                                        console.log(errorThrown)
                                    } 
                                    
                                        })
                                        console.log(code)
                                $.ajax({ 
            
                                            url: "libs/php/getExchange.php",
                                            type: 'POST',
                                            dataType: 'json',
                                            data: {
                                                currencyCode: code
                                            },
                                            success: function(result) {
                                                       
                                            if (result.status.name == "ok") {
                                                
                                                $('#exchangeRateUSD').html(result['data']['USD']);
                                                $('#exchangeRateEUR').html(result['data']['EUR']);
                                                $('#exchangeRateGPB').html(result['data']['GBP']);
                                            }
                                            
                                            },
                                            error: function(jqXHR, textStatus, errorThrown) {
                                                // your error code
                                                console.log(errorThrown)
                                            } 
                                            
                                        })
                                        
                                        var jointCountry2 = naitiveName.replace(/\s/g, "+").toLowerCase() //turns countries with two names into 1 name
                                        console.log(jointCountry2)
                                        $.ajax({ 
            
                                            url: "libs/php/places.php",
                                            type: 'POST',
                                            dataType: 'json',
                                            data: {
                                                airportLat:lat,
                                                airportLng:lng
                                            
                                                
                                            },
                                            success: function(result) {
                                                       
                                            if (result.status.name == "ok") {
                                                
                                                var placesArray = []
                                               for(var a=0; a < result['data'].length; a++){
                                                var nameAirport = result['data'][a]['name'];
                                                var Latairport = result['data'][a]['geometry']['location']['lat'];
                                                var Lngairport = result['data'][a]['geometry']['location']['lng'];
                                                var littleton_a = L.marker([Latairport, Lngairport], {icon: L.icon.glyph({ prefix: 'fas', glyph: 'plane'}) }).bindPopup(nameAirport);
                                                placesArray.push(littleton_a);
                                               }
                                               //console.log(placesArray)
                                               if (airports !== null) {
                                                mymap.removeLayer(airports);
                                            }
                                                airports = L.layerGroup(placesArray)
                                                
                                                if (airportCluster !== null) {
                                                    mymap.removeLayer(airportCluster);
                                                }
                                                airportCluster = L.markerClusterGroup();
                                                airportCluster.addLayer(airports);
                                                
                                            }
                                            
                                            },
                                            error: function(jqXHR, textStatus, errorThrown) {
                                                // your error code
                                                console.log(errorThrown)
                                            } 
                                            
                                        })
                                
                            }
                            
                           
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            // your error code
                        } 
    
                        
                    });
    
   
                    //calls weather API
                    $.ajax({
                        url: "libs/php/getWeather.php",
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            lat: lat,
                            lon: lng
                        },
                        success: function(result) {
                            //alert("working")
                            //console.log(result);
                              //  var hope = JSON.stringify(result)
                                //alert(hope)
                            if (result.status.name == "ok") {
            
                                var temp = parseInt(result['data']['temp']);
                                var midTemp = temp - 273.15;
                                var newTemp = midTemp.toFixed(2);
                                var tempFeels = parseInt(result['data']['feels_like']);
                                var midTempFeels = tempFeels - 273.15;
                                var newTempFeels = midTempFeels.toFixed(2);
                                $('#txtmain').html(result['data']['weather'][0]['main']);
                                $('#txtdescription').html(result['data']['weather'][0]['description']);
                                $('#txttemperature').html(newTemp);
                                $('#txtFeelsLike').html(newTempFeels); 
                                $('#txtHumidity').html(result['data']['humidity']);
                                $('#txtWind').html(result['data']['wind_speed']);
                            }
                           
    
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            // your error code
                        } 
    
                        
                    }); 
                     
                      
                }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    // your error code
                } 
            })
  }
       
////////////////////////////////////////////////////////////////////


//on webpage Load function
$(document).ready(function () {
    
    $.ajax({ //retrieve country name based on users click
    
        url: "libs/php/countryList.php",
        type: 'GET',
        dataType: 'json',
        
        success: function(result) {
                   
        if (result.status.name == "ok") {
            var select = document.getElementById("locality-dropdown");
           //console.log(result['data'])
           for(var i = 0; i < result['data'].length; i++){
            var opt = result['data'][i]['name'];
            var val = result['data'][i]['code'];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = val;
            select.appendChild(el); 
           }
           
        }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(errorThrown)
        } 
        
            }) 

    if ("geolocation" in navigator){ //check geolocation available 
        //try to get user current location using getCurrentPosition() method
        navigator.geolocation.getCurrentPosition(function(position){ 
                $("#result").html("Found your location <br />Lat : "+position.coords.latitude+" </br>Lang :"+ position.coords.longitude);
          
               $.ajax({ //retrieve country name based current location
    
                url: "libs/php/reverseGeocode.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                },
                success: function(result) {
                           
                if (result.status.name == "ok") {
            
                    console.log(result['data'][0]['components']['country']); 
                    var countryName = result['data'][0]['components']['ISO_3166-1_alpha-2']; 
                    document.getElementById('locality-dropdown').value=countryName; //sets dropdown to current country
                    var home = new L.marker([position.coords.latitude, position.coords.longitude], {icon: L.icon.glyph({ prefix: 'fas', glyph: 'home' }) })
                    home.addTo(mymap)
                    home.bindPopup("Your Location")
                    //oneCall()
                    everything();
                }
                
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    // your error code
                    alert(errorThrown)
                } 
                
                    })

            });
    }else{
        console.log("Browser doesn't support geolocation!");
    }

    
   
});

////////////////////////////////////////////////////////////////////

function oneCall() {

    $.ajax({ //retrieve country borders from geoJSON file
    
        url: "libs/php/countryBorders.php",
        type: 'GET',
        dataType: 'json',
        
        success: function(result) {
                   
        if (result.status.name == "ok") {
            for(var i = 0; i < result['data'].length; i++){

                if(result['data'][i]['properties']['iso_a2'] == document.getElementById("locality-dropdown").value){
                    geojson = {"type":"FeatureCollection","features": [{"type":"Feature","properties":result['data'][i]['properties'],"geometry":result['data'][i]['geometry']}]};
                   
                }
            }

                if (myLinesLayer !== null) {
                mymap.removeLayer(myLinesLayer);
            }
            
           myLinesLayer = L.geoJSON(geojson,{})
           myLinesLayer.addTo(mymap); 
           mymap.fitBounds(myLinesLayer.getBounds())
           
        }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(errorThrown)
        } 
        
            })

    $.ajax({ //retrieve country name based on users click
    
        url: "libs/php/everything.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: document.getElementById("locality-dropdown").value
        },
        success: function(result) {
                   
        if (result.status.name == "ok") {
            $('#countryName').html(result['data']['countryName']);
            
            $('#txtcapital').html(result['data']['capitalName']);
                                
            $('#txtpopulation').html(result['data']['population']);
            $('#txtcurrency').html(result['data']['currencyName']);
            $('#txtcurrencyCode').html(result['data']['currencyCode']);
            document.getElementById("flag").src = result['data']['flag'];
            $('#Language').html(result['data']['language']);
            $('#continent').html(result['data']['continent']);
            $('#currencySymbol').html(result['data']['currencySymbol']);
            $('#naitiveName').html(result['data']['naitiveName']);

            $('#txtdescription').html(result['data']['weather']);
            $('#txttemperature').html(result['data']['temp']);
            $('#txtFeelsLike').html(result['data']['feels_like']); 
            $('#txtHumidity').html(result['data']['humidity']);
            $('#txtWind').html(result['data']['wind_speed']);

            $('#exchangeRateUSD').html(result['data']['exchangeUSD']);
            $('#exchangeRateEUR').html(result['data']['exchangeEUR']);
            $('#exchangeRateGBP').html(result['data']['exchangeGBP']);

            $('#covidConfirmed').html(result['data']['covidConfirmed'][[result['data']['covidConfirmed'].length - 1]]);
            $('#covidDeaths').html(result['data']['covidDeaths'][[result['data']['covidDeaths'].length - 1]]);
            $('#covidRecovered').html(result['data']['covidRecovered'][result['data']['covidRecovered'].length - 1]);

            if (marker !== null) {
                mymap.removeLayer(marker);
            }

            marker = L.marker([result['data']['CapitalLat'], result['data']['CapitalLng']], {icon: L.icon.glyph({ prefix: 'fas', glyph: 'city' })}).addTo(mymap);
            marker.bindPopup("Capital City: " + result['data']['capitalName'])

            var ctxL = document.getElementById("lineChart").getContext('2d');
            var myLineChart = new Chart(ctxL, {
                                    type: 'line',
                                    data: {
                                    labels: result['data']['covidDate'],
                                    datasets: [{
                                    label: "Confirmed Cases",
                                    data: result['data']['covidConfirmed'],
                                    backgroundColor: [
                                    'rgba(105, 0, 132, .2)',
                                    ],
                                    borderColor: [
                                    'rgba(200, 99, 132, .7)',
                                    ],
                                    borderWidth: 1
                                    },
                                    {
                                    label: "Deaths",
                                    data: result['data']['covidDeaths'],
                                    backgroundColor: [
                                    'rgba(0, 137, 132, .2)',
                                    ],
                                    borderColor: [
                                    'rgba(0, 10, 130, .7)',
                                    ],
                                    borderWidth: 1
                                    },
                                    {
                                    label: "Recovered",
                                    data: result['data']['covidRecovered'],
                                    backgroundColor: [
                                    'rgba(132, 137, 0, .2)',
                                    ],
                                    borderColor: [
                                    'rgba(130, 10, 0, .7)',
                                    ],
                                    borderWidth: 1
                                    }
                                    ]
                                    },
                                    options: {
                                    responsive: true
                                    }
            });
        }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(errorThrown)
        } 
        
            }) 
}


////////////////////////////////////////////////////////////////////

//on changing the select dropdown call everythig function
$('select').on('change', function() {
    
    everything();

    
  });

 ////////////////////////////////////////////////////////////////////
 //allows clicking on countries instead of select drop down
 function onMapClick(e) {
    var coord = e.latlng;
    var lat = coord.lat;
     var lng = coord.lng;


     $.ajax({ //retrieve country name based on users click
    
        url: "libs/php/reverseGeocode.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: lat,
            lng: lng
        },
        success: function(result) {
                   
        if (result.status.name == "ok") {
    
            console.log(result['data'][0]['components']['country']);
            var countryName = result['data'][0]['components']['ISO_3166-1_alpha-2'];
            document.getElementById('locality-dropdown').value=countryName; //sets clicked country on drop down
            
            everything();
        }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            alert(errorThrown)
        } 
        
            })
  }
//applies mapclick function to map
  mymap.on('click', onMapClick);
////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////
L.easyButton('<img src="libs/svg/globe-solid.svg" style="width:16px">', function(btn, map) {
    $('#myModal').modal('show');
}, 'Information 1').addTo(mymap);

L.easyButton('<img src="libs/svg/cloud-sun-solid.svg" style="width:16px">', function(btn, map) {
    $('#myModal2').modal('show');
}, 'Weather').addTo(mymap);

L.easyButton('<img src="libs/svg/wallet-solid.svg" style="width:16px">', function(btn, map) {
    $('#myModal3').modal('show');
}, 'Information 2').addTo(mymap);

L.easyButton('<img src="libs/svg/disease-solid.svg" style="width:16px">', function(btn, map) {
    $('#myModal4').modal('show');
}, 'Covid chart').addTo(mymap);

L.easyButton('<img src="libs/svg/plane-departure-solid.svg" style="width:16px">', function(btn, map) {
   
    if(mymap.hasLayer(airportCluster)) {
        
        mymap.removeLayer(airportCluster);
    } else {
        mymap.addLayer(airportCluster);        
        
   }


}, 'airports').addTo(mymap);

L.easyButton( '<img src="libs/svg/info-circle-solid.svg" style="width:16px">', function(){
  //alert('you just clicked the html entity \&starf;');
  $('#myModal5').modal('show');
}).addTo(mymap);

////////////////////////////////////////////////////////////////////
//add margins to select box
//Icon for weather formatting
//set currency to one line
//look at bootstrap tables
//street map and satalite map
//feature groups layer control for airports/landmarks etc
//add news for country

