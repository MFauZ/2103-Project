//Map initilize
var center = L.bounds([1.56073, 105.11475], [1.16, 103.502]).getCenter();
var map = L.map('mapdiv').setView([center.x, center.y], 12);
var basemap = L.tileLayer('https://maps-{s}.onemap.sg/v3/Grey/{z}/{x}/{y}.png', {
	detectRetina: true,
	maxZoom: 18,
	minZoom: 13		});

//Set map boundaries
map.setMaxBounds([[1.48073, 104.1147], [1.16, 103.602]]);

//Add map to screen
basemap.addTo(map);

//Get user current location
function getUserLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showUserPosition);
	} 
}

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