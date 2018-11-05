//Map buttons and interfaces
var zoomIn = document.getElementById("zoomIn");
var zoomOut = document.getElementById("zoomOut");

var closeModal = document.getElementsByClassName("closeModal");

var propertyModal = document.getElementById("propertyModal");
var propertyButton = document.getElementById("propertyButton");

var amenitiesModal = document.getElementById("amenitiesModal");
var amenitiesButton = document.getElementById("amenitiesButton");

var grantModal = document.getElementById("grantModal");
var grantButton = document.getElementById("grantButton")

var profileModal = document.getElementById("profileModal");
var profileButton = document.getElementById("profileButton")

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
var y = document.getElementById("f");

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    y.innerHTML = this.value + "km";
}


propertyButton.onclick = function(){
	propertyModal.classList.toggle("clicked");
	console.log("House show");
};

amenitiesButton.onclick = function(){
	amenitiesModal.classList.toggle("clicked");
	console.log("Amenities show");
};

grantButton.onclick = function(){
	grantModal.classList.toggle("clicked");
	console.log("Amenities show");
};

profileButton.onclick = function(){
	profileModal.classList.toggle("clicked");
	console.log("Profile show");
};


closeModal.onclick = function(){
	console.log("Close Modal");
};

zoomIn.onclick = function(){
	map.setZoom(map.getZoom() + 1)
	console.log("Zoom in by 1");
};

zoomOut.onclick = function(){
	map.setZoom(map.getZoom() - 1)
	console.log("Zoom out by 1");
};