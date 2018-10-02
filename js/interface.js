//Map buttons and interfaces
var sideModal = document.getElementById("houseModal");
var houseButton = document.getElementById("houseButton");

var closeModal = document.getElementsByClassName("closeModal");

var zoomIn = document.getElementById("zoomIn");
var zoomOut = document.getElementById("zoomOut");


houseButton.onclick = function(){
	sideModal.classList.toggle("clicked");
	console.log("House show");
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
