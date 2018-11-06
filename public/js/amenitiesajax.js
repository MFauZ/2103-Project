$(() => {

	//Get values from 'proxmity' and 'marked location'
	var proxmity = $('#proxmity'.value);
	var currentLocation = $('#currentLocation'.value);

	//Checkboxes
	const $primarysch = $('#primarysch');
	const $secondarysch = $('#secsch');
	const $combsch = $('#combsch');
	const $busstops = $('#busstops');
	const $mrtstations = $('#mrtstations');
	const $npc = $('#npc');
	const $npp = $('#npp');
	const $hawker = $('#hawker');

	$primarysch.on('change', runPrimary);
	$secondarysch.on('change', runSecondary);
	$combsch.on('change', runCombined);
	$busstops.on('change', runBusstops);
	$mrtstations.on('change', runMrtstations);
	$npc.on('change', runNpc);
	$npp.on('change', runNpp);
	$hawker.on('change', runHawker);


	// --------------Schools --------------- //

	// Check if primary school query is requested
	function runPrimary() {
		if (this.checked){
			console.log("Show Primary School");

			const data = {
		      method: 'POST',
		      url: '/primarysch',
		      data: {'test': 'Azman'}
		    };

		    $.ajax(data).done(res => {
		      console.log(data);
		      runPrimaryQuery();
		    });
		}
	};

	// Execute primary school query and return it
	function runPrimaryQuery() {
		const data = {
	      method: 'GET',
	      url: '/primarysch',
	      data : {'testget': 'Azman again'}
	    };

	    $.ajax(data).done(res => {
	    	console.log(res);
	    });
	}

	// Check if secondary school query is requested
	function runSecondary() {
		if (this.checked){
			console.log("Show Secondary School");

			const data = {
		      method: 'POST',
		      url: '/secondarysch',
		      data: {'test': 'Throw some data here'}
		    };

		    $.ajax(data).done(res => {
		      console.log(data);
		      runSecondaryQuery();
		    });
		}
	};

	// Execute secondary school query and return it
	function runSecondaryQuery() {
		const data = {
	      method: 'GET',
	      url: '/secondarysch',
	      data : {'testget': 'Some query data thrown at us'}
	    };

	    $.ajax(data).done(res => {
	    	console.log(res);
	    });
	}

	// Check if combined school query is requested
	function runCombined() {
		if (this.checked){
			console.log("Show Combined School");

			const data = {
		      method: 'POST',
		      url: '/combinedsch',
		      data: {'test': 'Throw some data here'}
		    };

		    $.ajax(data).done(res => {
		      console.log(data);
		      runCombinedQuery();
		    });
		}
	};

	// Execute combined school query and return it
	function runCombinedQuery() {
		const data = {
	      method: 'GET',
	      url: '/combinedsch',
	      data : {'testget': 'Some query data thrown at us'}
	    };

	    $.ajax(data).done(res => {
	    	console.log(res);
	    });
	}

	// --------------Transport --------------- //

	// Check if bus stops query is requested
	function runBusstops() {
		if (this.checked){
			console.log("Show Bus Stops");

			const data = {
		      method: 'POST',
		      url: '/busstops',
		      data: {'test': 'Throw some data here'}
		    };

		    $.ajax(data).done(res => {
		      console.log(data);
		      runBusstopsQuery();
		    });
		}
	};

	// Execute bus stops query and return it
	function runBusstopsQuery() {
		const data = {
	      method: 'GET',
	      url: '/busstops',
	      data : {'testget': 'Some query data thrown at us'}
	    };

	    $.ajax(data).done(res => {
	    	console.log(res);
	    });
	}

	// Check if mrt stations query is requested
	function runMrtstations() {
		if (this.checked){
			console.log("Show MRT stations");

			const data = {
		      method: 'POST',
		      url: '/mrtstations',
		      data: {'test': 'Throw some data here'}
		    };

		    $.ajax(data).done(res => {
		      console.log(data);
		      runMrtstationsQuery();
		    });
		}
	};

	// Execute mrt stations query and return it
	function runMrtstationsQuery() {
		const data = {
	      method: 'GET',
	      url: '/mrtstations',
	      data : {'testget': 'Some query data thrown at us'}
	    };

	    $.ajax(data).done(res => {
	    	console.log(res);
	    });
	}

	// Check if NPC query is requested
	function runNpc() {
		if (this.checked){
			console.log("Show NPCs");

			const data = {
		      method: 'POST',
		      url: '/npc',
		      data: {'test': 'Throw some data here'}
		    };

		    $.ajax(data).done(res => {
		      console.log(data);
		      runNpcQuery();
		    });
		}
	};

	// Execute bus stops query and return it
	function runNpcQuery() {
		const data = {
	      method: 'GET',
	      url: '/npc',
	      data : {'testget': 'Some query data thrown at us'}
	    };

	    $.ajax(data).done(res => {
	    	console.log(res);
	    });
	}

	// Check if NPP query is requested
	function runNpp() {
		if (this.checked){
			console.log("Show NPPs");

			const data = {
		      method: 'POST',
		      url: '/npp',
		      data: {'test': 'Throw some data here'}
		    };

		    $.ajax(data).done(res => {
		      console.log(data);
		      runNppQuery();
		    });
		}
	};

	// Execute NPP query and return it
	function runNppQuery() {
		const data = {
	      method: 'GET',
	      url: '/npp',
	      data : {'testget': 'Some query data thrown at us'}
	    };

	    $.ajax(data).done(res => {
	    	console.log(res);
	    });
	}

	// Check if hawker query is requested
	function runHawker() {
		if (this.checked){
			console.log("Show hawkerss");

			const data = {
		      method: 'POST',
		      url: '/hawker',
		      data: {'test': 'Throw some data here'}
		    };

		    $.ajax(data).done(res => {
		      console.log(data);
		      runhawkerQuery();
		    });
		}
	};

	// Execute hawker query and return it
	function runhawkerQuery() {
		const data = {
	      method: 'GET',
	      url: '/hawker',
	      data : {'testget': 'Some query data thrown at us'}
	    };

	    $.ajax(data).done(res => {
	    	console.log(res);
	    });
	}


});



console.log("Amenities AJAX assets loaded");