//--------------------------------------Map functions---------------------------------//
//Map initilize
var center = L.bounds([1.56073, 105.11475], [1.16, 102.550]).getCenter();
var map = L.map('mapdiv').setView([center.x, center.y], 12);
var basemap = L.tileLayer('https://maps-{s}.onemap.sg/v3/Grey/{z}/{x}/{y}.png', {
	//detectRetina: true,
	zoomControl: false,
	maxZoom: 18,
	minZoom: 12,
});



basemap.addTo(map); 											//Add map to screen
map.removeControl(map.zoomControl); 							//Remove default map controls
map.setMaxBounds([[1.48073, 104.1147], [1.16, 103.602]]); 		//Set map boundaries

//Set coordinates of map area clicked
map.on('click', 
	function(e){
		var coord = e.latlng.toString().split(',');
		var lat = coord[0].split('(');
		var lng = coord[1].split(')');
		console.log("Latitude: " + lat[1] + " and Longitude:" + lng[0]);
	});

//Get user current location
function getUserLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showUserPosition);
	} 
}

//Add search bar to map
new L.Control.GPlaceAutocomplete({
	callback: function(place){
		var loc = place.geometry.location;
		map.panTo([loc.lat(), loc.lng()]);
		map.setZoom(18);
	}
}).addTo(map);

//Content for user location pin
function showUserPosition(position) {						
	marker = new L.Marker([position.coords.latitude, position.coords.longitude], {bounceOnAdd: false}).addTo(map);						 
	var popup = L.popup()
	.setLatLng([position.coords.latitude, position.coords.longitude]) 
	.setContent('You are here!')
	.openOn(map);					
}

getUserLocation()


// var latlngs = [
//     [1.379781, 103.732491],
//     [1.369530, 103.748643]
// ];
// var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);

var myStyle = {
	"color": "#FC4445",
	"weight": 5,
	"opacity": 0.5
};

var x = L.geoJson(SGBoundaries, {
	style: myStyle
})

function showBoundaries(){
	var status = 0;
	x.addTo(map);
}
function showBoundaries2(){
	L.clearLayers()

}





/*************Start of functions for Housing tab*************/



var markers = [];


var selVal = $('#localeDDL').val();
console.log(selVal);
// With new DB queries

function showResidential(){
	// default All so display straight away


	// drop down selcteion change
	selVal =  $('#localeDDL').val();
	console.log(selVal);

	if (selVal == "all"){
		var xhr = new XMLHttpRequest();
		xhr.timeout = 2000;
		xhr.onreadystatechange = function(e){
			    // console.log(this);
			    if (xhr.readyState === 4){
			    	if (xhr.status === 200){            
						// filter out the key value pairs u need
						res = JSON.parse(xhr.response);		
						// Use performTask to plot N amount of pins at a time (every 10ms)
						performTask(res,100,function(items,index){
							console.log(items[index]);
							$('body').append('<a id="marker_' + index + '" href="#">Marker ' + index + '</a><br>');
						 	// Mark the locations on map
						 	markers.push(L.marker([items[index].latitude,items[index].longitude],{title:'marker_' + index + ''})
						 		.addTo(map).bindPopup(items[index].id));
						 	// Below code needed for plotting more markers for nearby amentities function
							// var marker = new L.Marker([items[index].latitude, items[index].longitude]).on('click', markerOnClick).addTo(map);

						});


					} else {
						console.error("XHR didn't work: ", xhr.status);
					}
				}
			}
			xhr.ontimeout = function (){
				console.error("request timedout: ", xhr);
			}
			xhr.open("get", "http://localhost:3000/residentialWithDistrict" , /*async*/ true);
			xhr.send();

		}


		else if (selVal == "Ang Mo Kio"){
			var xhr = new XMLHttpRequest();
			xhr.timeout = 2000;
			xhr.onreadystatechange = function(e){
			    // console.log(this);
			    if (xhr.readyState === 4){
			    	if (xhr.status === 200){            
						// filter out the key value pairs u need
						res = JSON.parse(xhr.response);		
						// Use performTask to plot N amount of pins at a time (every 10ms)
						performTask(res,50,function(items,index){
							console.log(items[index]);
							$('body').append('<a id="marker_' + index + '" href="#">Marker ' + index + '</a><br>');
						 	// Mark the locations on map
						 	markers.push(L.marker([items[index].latitude,items[index].longitude],{title:'marker_' + index + ''})
						 		.addTo(map).bindPopup(items[index].id));
							// var marker = new L.Marker([items[index].latitude, items[index].longitude]).on('click', markerOnClick).addTo(map);

						});


					} else {
						console.error("XHR didn't work: ", xhr.status);
					}
				}
			}
			xhr.ontimeout = function (){
				console.error("request timedout: ", xhr);
			}
			xhr.open("get", "http://localhost:3000/residentialWithDistrictSearch/" + selVal, /*async*/ true);
			xhr.send();
		}
		else if (selVal == "2"){
			var xhr = new XMLHttpRequest();
			xhr.timeout = 2000;
			xhr.onreadystatechange = function(e){
			    // console.log(this);
			    if (xhr.readyState === 4){
			    	if (xhr.status === 200){            
						// filter out the key value pairs u need
						res = JSON.parse(xhr.response);		
						// Use performTask to plot N amount of pins at a time (every 10ms)
						
						// Testing remove marker
						var marker = L.marker([0, 0]).addTo(map);
						map.removeLayer(marker);
						



					} else {
						console.error("XHR didn't work: ", xhr.status);
					}
				}
			}
			xhr.ontimeout = function (){
				console.error("request timedout: ", xhr);
			}
			xhr.open("get", "http://localhost:3000/residentialWithDistrictSearch/" + selVal, /*async*/ true);
			xhr.send();
		}



	} // end of button click function




/*************End Housing tab functions*************/


/*************Misc functions*************/
	function performTask(items, numToProcess, processItem) {
		var pos = 0;
    // This is run once for every numToProcess items.
    function iteration() {
        // Calculate last position.
        var j = Math.min(pos + numToProcess, items.length);
        // Start at current position and loop to last position.
        for (var i = pos; i < j; i++) {
        	processItem(items, i);
        }
        // Increment current position.
        pos += numToProcess;
        // Only continue if there are more items to process.
        if (pos < items.length)
            setTimeout(iteration, 10); // Wait 10 ms to let the UI update.
    }
    iteration();
}




// detect which marker has been clicked, retrieve its latlng and find nearby amenities. then plot these amenities
function markerOnClick(e)
{
	for(var i=0; i<res.length; i++){
		alert();
		var element = document. getElementById('marker_' + i);
		element.parentNode.removeChild(element);
	}

	console.log("hi. you clicked the marker at " + e.latlng);
	var regExp = /\(([^)]+)\)/; // get lat lng values in brackets '(' ')'
	var selectedLatLng = regExp.exec(e.latlng);
	//matches[1] contains the value between the parentheses	
	var lat = selectedLatLng[1].split(',')[0];
	var lng = selectedLatLng[1].split(',')[1];
	console.log(lat,lng);

	getNearbyAmenities_withGivenLocation(lat,lng);
}


/*************End Misc functions*************/
