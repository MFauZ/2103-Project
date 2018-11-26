$(() => {

	//Get values from 'proxmity' and 'marked location'
	//var proximity = document.getElementById("proximity").innerHTML;

	//Checkboxes
	const $primarysch = $('#primarysch');
	const $secondarysch = $('#secsch');
	const $combsch = $('#combsch');
	const $busstops = $('#busstops');
	const $mrtstations = $('#mrtstations');
	const $npc = $('#npc');
	const $npp = $('#npp');
	const $hawker = $('#hawker');

	$primarysch.on('change', runPrimaryQuery);
	$secondarysch.on('change', runSecondaryQuery);
	$combsch.on('change', runCombinedQuery);
	$busstops.on('change', runBusstopsQuery);
	$npc.on('change', runNpcQuery);
	$npp.on('change', runNppQuery);
	$hawker.on('change', runhawkerQuery);

	document.getElementById("currentlocation").value = "1.37007 103.84895";

	// --------------Schools --------------- //

	function getProximity(){
		var proximity = document.getElementById("proximity").innerHTML.split('k')[0];
		proximity = proximity/2;
		return proximity;
	}

	function getCoordinates(){
		var coordinates = document.getElementById("currentlocation").value;
		return coordinates;
	}

	// Execute primary school query and return it
	function runPrimaryQuery() {
		if (this.checked){
			const data = {
		      method: 'GET',
		      url: '/primarysch',
		      data: {'proximity': getProximity(), 'latitude': getCoordinates().split(' ')[0], 'longitude':getCoordinates().split(' ')[1]}
		    };

		    $.ajax(data).done(res => {
		    	console.log(res);

		      // Create custom icon
		      var housingIcon = L.icon({
		      iconUrl: 'js/images/pschool.svg',
		      iconSize: [50, 50], // size of the icon
		      popupAnchor: [0,-15]
		      });
		    
		      // Specify popup options 
		      var customOptions =
		        {
		        'maxWidth': '500',
		        'className' : 'custom'
		        }

		      // Loop through contents of JSON query
		      for (i=0; i<res.length;i++){
		          L.marker([res[i]['location']['coordinates']['1'], res[i]['location']['coordinates']['0']], {icon: housingIcon}).bindPopup(popupContents("<b>"+res[i]['school_name']+"</b><p>"+res[i]['aid_type']+"<br>"+res[i]['street_name']+"<br>"+res[i]['url']+"<p>"),customOptions).addTo(pschoolGroup);
		      }
		    });
		}
	    pschoolGroup.clearLayers();
	}

	//Declare pop up content here
	  function popupContents(string){
	    return string;
	}

	// Execute secondary school query and return it
	function runSecondaryQuery() {
		if (this.checked){
			const data = {
		      method: 'GET',
		      url: '/secondarysch',
		      data: {'proximity': getProximity(), 'latitude': getCoordinates().split(' ')[0], 'longitude':getCoordinates().split(' ')[1]}
		    };

		    $.ajax(data).done(res => {
		    	console.log(res);

		    	// Create custom icon
				var housingIcon = L.icon({
				iconUrl: 'js/images/sschool.svg',
				iconSize: [50, 50], // size of the icon
				popupAnchor: [0,-15]
				});

				// Specify popup options 
				var customOptions =
				{
				'maxWidth': '500',
				'className' : 'custom'
				}

				// Loop through contents of JSON query
				for (i=0; i<res.length;i++){
				  L.marker([res[i]['location']['coordinates']['1'], res[i]['location']['coordinates']['0']], {icon: housingIcon}).bindPopup(popupContents("<b>"+res[i]['school_name']+"</b><p>"+res[i]['aid_type']+"<br>"+res[i]['street_name']+"<br>"+res[i]['url']+"<p>"),customOptions).addTo(sschoolGroup);
				}
		    });
		}
	    sschoolGroup.clearLayers();
	}

	// Execute combined school query and return it
	function runCombinedQuery() {
		if (this.checked){
			const data = {
		      method: 'GET',
		      url: '/combinedsch',
		      data: {'proximity': getProximity(), 'latitude': getCoordinates().split(' ')[0], 'longitude':getCoordinates().split(' ')[1]}
		    };

		    $.ajax(data).done(res => {
		    	console.log(res);

		    	// Create custom icon
				var housingIcon = L.icon({
				iconUrl: 'js/images/cschool.svg',
				iconSize: [50, 50], // size of the icon
				popupAnchor: [0,-15]
				});

				// Specify popup options 
				var customOptions =
				{
				'maxWidth': '500',
				'className' : 'custom'
				}

				// Loop through contents of JSON query
				for (i=0; i<res.length;i++){
				  L.marker([res[i]['location']['coordinates']['1'], res[i]['location']['coordinates']['0']], {icon: housingIcon}).bindPopup(popupContents("<b>"+res[i]['school_name']+"</b><p>"+res[i]['aid_type']+"<br>"+res[i]['street']+"<br>"+res[i]['url']+"<p>"),customOptions).addTo(cschoolGroup);
				}
		    });
		}
	    cschoolGroup.clearLayers();
	}

	// --------------Transport --------------- //

	// Execute bus stops query and return it
	function runBusstopsQuery() {
		if (this.checked){
			const data = {
		      method: 'GET',
		      url: '/busstops',
		      data: {'proximity': getProximity(), 'latitude': getCoordinates().split(' ')[0], 'longitude':getCoordinates().split(' ')[1]}
		    };

		    $.ajax(data).done(res => {
		    	console.log(res);

		    	// Create custom icon
				var housingIcon = L.icon({
				iconUrl: 'js/images/bus.svg',
				iconSize: [30, 30], // size of the icon
				popupAnchor: [0,-15]
				});

				// Specify popup options 
				var customOptions =
				{
				'maxWidth': '500',
				'className' : 'custom'
				}

				// Loop through contents of JSON query
				for (i=0; i<res.length;i++){
				  L.marker([res[i]['location']['coordinates']['1'], res[i]['location']['coordinates']['0']], {icon: housingIcon}).bindPopup(popupContents("<b>"+res[i]['bs_name']+"</b><p>"+res[i]['bs_code']+"<br> Along "+res[i]['street']+"<p>"),customOptions).addTo(busGroup);
				}
		    });
		}
	    busGroup.clearLayers();
	}

	// Execute NPC query and return it
	function runNpcQuery() {
		if (this.checked){
			const data = {
		      method: 'GET',
		      url: '/npc',
		      data: {'proximity': getProximity(), 'latitude': getCoordinates().split(' ')[0], 'longitude':getCoordinates().split(' ')[1]}
		    };

		    $.ajax(data).done(res => {
		    	console.log(res);

		    	// Create custom icon
				var housingIcon = L.icon({
				iconUrl: 'js/images/npc.svg',
				iconSize: [30, 30], // size of the icon
				popupAnchor: [0,-15]
				});

				// Specify popup options 
				var customOptions =
				{
				'maxWidth': '500',
				'className' : 'custom'
				}

				// Loop through contents of JSON query
				for (i=0; i<res.length;i++){
				  L.marker([res[i]['location']['coordinates']['1'], res[i]['location']['coordinates']['0']], {icon: housingIcon}).bindPopup(popupContents("<b>"+res[i]['npc_name']+"</b><p>"+res[i]['division_name']+"<br>Operating Hours: "+res[i]['operating_hours']+"<br> Along "+res[i]['street']+"<br> Contact: "+res[i]['telephone']+"<p>"),customOptions).addTo(npcGroup);
				}
		    });
		}
	    npcGroup.clearLayers();
	}

	// Execute NPP query and return it
	function runNppQuery() {
		if (this.checked){
			const data = {
		      method: 'GET',
		      url: '/npp',
		      data: {'proximity': getProximity(), 'latitude': getCoordinates().split(' ')[0], 'longitude':getCoordinates().split(' ')[1]}
		    };

		    $.ajax(data).done(res => {
		    	console.log(res);

		    	// Create custom icon
				var housingIcon = L.icon({
				iconUrl: 'js/images/npp.svg',
				iconSize: [30, 30], // size of the icon
				popupAnchor: [0,-15]
				});

				// Specify popup options 
				var customOptions =
				{
				'maxWidth': '500',
				'className' : 'custom'
				}

				// Loop through contents of JSON query
				for (i=0; i<res.length;i++){
				  L.marker([res[i]['location']['coordinates']['1'],res[i]['location']['coordinates']['0']], {icon: housingIcon}).bindPopup(popupContents("<b>"+res[i]['npc_name']+"</b><p>"+res[i]['division_name']+"<br>Operating Hours: "+res[i]['operating_hours']+"<br> Along "+res[i]['street']+"<br> Contact: "+res[i]['telephone']+"<p>"),customOptions).addTo(nppGroup);
				}
		    });
		}
	    nppGroup.clearLayers();
	}

	
	// Execute hawker query and return it
	function runhawkerQuery() {
		if (this.checked){
			const data = {
		      method: 'GET',
		      url: '/hawker',
		      data: {'proximity': getProximity(), 'latitude': getCoordinates().split(' ')[0], 'longitude':getCoordinates().split(' ')[1]}
		    };

		    $.ajax(data).done(res => {
		    	console.log(res);

		    	// Create custom icon
				var housingIcon = L.icon({
				iconUrl: 'js/images/hawker.svg',
				iconSize: [30, 30], // size of the icon
				popupAnchor: [0,-15]
				});

				// Specify popup options 
				var customOptions =
				{
				'maxWidth': '500',
				'className' : 'custom'
				}

				// Loop through contents of JSON query
				for (i=0; i<res.length;i++){
				  L.marker([res[i]['location']['coordinates']['1'], res[i]['location']['coordinates']['0']], {icon: housingIcon}).bindPopup(popupContents("<b>"+res[i]['hawker_name']+"</b><p> Along "+res[i]['street']+"</p>"),customOptions).addTo(hawkerGroup);
				}
		    });
		}
	    hawkerGroup.clearLayers();
	}

});

console.log("Amenities AJAX assets loaded");