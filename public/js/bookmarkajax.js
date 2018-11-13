// Get housing form data
function runBookmarks(bookmarkdata) {

	var location = bookmarkdata.split(',')[0];
	var block = bookmarkdata.split(',')[1];

	const data = {
	  method: 'POST',
	  url: '/bookmark',
	  data: {'location': location, 'block': block}
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
    url: '/bookmark',
    data : {'wow': 'wow'}
  };

  $.ajax(data).done(res => {
    console.log(res);

    var tableBody = $('#bookmarkTable tbody');

    tableBody.html('');

    res.bookmarks.forEach(function(bookmark){
    	tableBody.append('<tr><td>'+bookmark.bookmark_name+'</td><td><button class="btn search" value='+bookmark.lid+' onClick="showBookmark(this.value)">Show</button></td><td><button class="btn search deleteBtn" value='+bookmark.bookmark_name+' onClick="deleteBookmark(this.value)">Delete</button></td></tr>');
    });
  });

};

// Show bookmarks list
function showBookmark(lid) {

	const data = {
	    method: 'GET',
	    url: '/showbookmark',
	    data : {'lid':lid}
 	 };

	$.ajax(data).done(res => {
	  console.log(res);

	  // Create custom icon
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

      // Loop through contents of JSON query
      L.marker([res[0]['latitude'], res[0]['longitude']], {icon: housingIcon}).bindPopup(customPopup,customOptions).addTo(bookmarkGroup);
      

	});
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