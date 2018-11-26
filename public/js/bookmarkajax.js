// Get housing form data
function runBookmarks(bookmarkdata) {

	var location = bookmarkdata.split(',')[0];
	var block = bookmarkdata.split(',')[1];
	var postal_code = bookmarkdata.split(',')[2];

	const data = {
	  method: 'POST',
	  url: '/bookmark',
	  data: {'location': location, 'block': block, 'postal_code': postal_code}
	};

	$.ajax(data).done(res => {
	  console.log(res);
	  runBookmarksQuery()
	});
};

//  // Get SQL results and pin onto the map
function runBookmarksQuery() {

  const data = {
    method: 'GET',
    url: '/bookmark'
  };

  $.ajax(data).done(res => {

    console.log(res);

    var tableBody = $('#bookmarkTable tbody');

    tableBody.html('');

    for (var i=0; i< res.length; i++){
    	var block = res[i]['bookmark_details'][0]['block'];
    	var postal = res[i]['bookmark_details'][0]['postal_code'];
    	var location = res[i]['bookmark_details'][0]['location']['coordinates'];
    	tableBody.append('<tr><td>'+block+'</td><td><button class="btn search" value='+location+' onClick="showBookmark(this.value)">Show</button></td><td><button class="btn search deleteBtn" value='+postal+' onClick="deleteBookmark(this.value)">Delete</button></td></tr>');
    }
  });
};

// Show bookmarks list
function showBookmark(lid) {

	//Create custom icon
	var housingIcon = L.icon({
		iconUrl: 'js/images/bookmark.svg',
		iconSize: [50, 50], // size of the icon
		popupAnchor: [0,-15]
	});

	var customPopup = "<img src='http://joshuafrazier.info/images/maptime.gif' alt='maptime logo gif' width='350px'/>";

	// Specify popup options 
	var customOptions =
	{
	'maxWidth': '500',
	'className' : 'custom'
	}

	var longitude = lid.split(',')[0];
	var latitude = lid.split(',')[1];

	L.marker([latitude, longitude], {icon: housingIcon}).bindPopup(customPopup,customOptions).addTo(bookmarkGroup);
};

// Delete bookmark
function deleteBookmark(bid) {

	const data = {
	  method: 'DELETE',
	  url: '/bookmark',
	  data: {'bid': bid}
	};

	$.ajax(data).done(res => {
	  runBookmarksQuery()
	  console.log('Deleted');
	});
};

runBookmarksQuery();