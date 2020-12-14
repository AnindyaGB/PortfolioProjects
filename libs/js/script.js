
//adding country selections to navbar select from geoJSON files
   var select = document.getElementById("locality-dropdown"); 
   var options = []; 
   var value = [];
for(var i = 0; i < countryBorders['features'].length; i++) {
    //var opt = options[i];
    options.push(countryBorders['features'][i]['properties']['name']);
    }
    options.sort();

for(var i = 0; i < options.length; i++) {
    //var opt = options[i];
    var opt = options[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el); }

    
   

//creating map and tile
var mymap = L.map('mapid').locate({setView: true, maxZoom: 16});
	
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);
    

//funtion that runs through all the AJAX calls and applies them to the HTML
function everything(){
    var jointCountry = document.getElementById("locality-dropdown").value.replace(/\s/g, "%20") //turns countries with two names into 1 name

        $.ajax({
            
			url: "libs/php/forwardGeocode.php",
			type: 'POST',
			dataType: 'json',
			data: {
				
				country: jointCountry
				
			},
			success: function(result) {
				
				//console.log(result);
					
				if (result.status.name == "ok") {

					console.log(result['data'][0]['geometry']['lat']);
                    console.log(result['data'][0]['geometry']['lng']);
                    lat = result['data'][0]['geometry']['lat']
                    lng = result['data'][0]['geometry']['lng']
                    $('#countryName').html(document.getElementById("locality-dropdown").value)
                    $('#coordinates').html(lat);
                    //mymap.setView([lat, lng], 6)
                    
                    //let geoJSON = {}

                    for(var j = 0; j < countryBorders['features'].length; j++){
                        //find geoJSON layer associated with selected country
                        if(countryBorders['features'][j]['properties']['name'] == document.getElementById("locality-dropdown").value){
                           geojson = {"type":"FeatureCollection","features": [{"type":"Feature","properties":countryBorders['features'][j]['properties'],"geometry":countryBorders['features'][j]['geometry']}]};
                            console.log(countryBorders['features'][j]['properties']['name'])
                            var iso_a2 = countryBorders['features'][j]['properties']['iso_a2'] //retrieve selected country iso_a2 value

                        }
                    }
                    
                    //add geoJSON for selected country 
                   var myLinesLayer = L.geoJSON(geojson,{})
                   myLinesLayer.addTo(mymap); 
                   mymap.fitBounds(myLinesLayer.getBounds())

                   //calls covid API. DOESN'T WORK YET. RETURNED RESULT NOT JSON. NEED TO FIX
                   $.ajax({
                               
                    url: "libs/php/covid.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        country: jointCountry
                    },
                    success: function(result) {
                        
                        if (result.status.name == "ok") {
                            alert("works")
                            $('#covidConfirmed').html(result['data']['Confirmed']);
                            
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
                        country: iso_a2
                    },
                    success: function(result) {
                        
                        if (result.status.name == "ok") {
                            //applies info to HTML
                            $('#txtcapital').html(result['data']['capital']);
                            $('#txtpopulation').html(result['data']['population']);
                            $('#txtcurrency').html(result['data']['currencies'][0]['name']);
                            var code = result['data']['currencies'][0]['code']
                            $('#timeZone').html(result['data']['timezones']);
                            document.getElementById("flag").src = result['data']['flag'];
                            $('#Language').html(result['data']['languages'][0]["name"]);
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
        
                            $('#txtmain').html(result['data']['weather'][0]['main']);
                            $('#txtdescription').html(result['data']['weather'][0]['description']);
                            
                             
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



//on webpage Load function
    $(document).ready(function () {
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
                        var countryName = result['data'][0]['components']['country']; 
                        document.getElementById('locality-dropdown').value=countryName; //sets dropdown to current country
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


//on changing the select dropdown call everythig function
    $('select').on('change', function() {
        //forwardSimp(this.value);
        everything();

        
      });

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
                var countryName = result['data'][0]['components']['country'];
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

//hides 2nd information table
      $('#table2').hide();

//toggles between showing the 1st information table and 2nd information table
      L.easyButton( '<span class="star">&starf;</span>', function(){
        $('#table, #table2').toggle()
      }).addTo(mymap);