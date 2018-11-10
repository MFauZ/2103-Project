$(() => {
  const $form = $('#housingajax');
  const $form2 = $('#bookmarkajax');

  $("#checkAll").click(function () {
    console.log('Selected all')
    $('#housingajax input:checkbox').not(this).prop('checked', this.checked);
  });

  $form.on('submit', runHousing);
  $form2.on('submit', runBookmarks);

  // Get housing form data
  function runHousing(e) {
    e.preventDefault();

    const data = {
      method: 'POST',
      url: '/housing',
      data: $form.serialize()
    };

    $.ajax(data).done(res => {
      runHousingQuery(res.locale,res.year,res.room);
    });
  };

  // Get SQL results and pin onto the map
  function runHousingQuery(locale,year,room) {

    const data = {
      method: 'GET',
      url: '/housing',
      data : {'locale': locale,'year': year,'room': room}
    };

    $.ajax(data).done(res => {
      console.log(res);

      // Create custom icon
      var housingIcon = L.icon({
      iconUrl: 'http://www.teoyusiang.com/buildingsingapore/bs/rainbowhdb.svg',
      iconSize: [100, 100], // size of the icon
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
          L.marker([res[i]['latitude'], res[i]['longitude']], {icon: housingIcon}).bindPopup(popupContents("<b>Block "+res[i]['block']+"</b><p>Year built:"+res[i]['year']+"<br>Floors:"+res[i]['floors']+"<p>"),customOptions).addTo(housingGroup);
      }

    });

    //Clear map pins after being called
    housingGroup.clearLayers();
  };

  //Declare pop up content here
  function popupContents(string){
    return string;
  }

  // Get bookmark form data
  function runBookmarks(e) {

    e.preventDefault();

    const data = {
      method: 'POST',
      url: '/bookmark',
      data: $form2.serialize()
    };

    $.ajax(data).done(res => {
      runBookmarksQuery(res.bookmarkname,res.postalcode);
    });
  };

   // Get SQL results and pin onto the map
  function runBookmarksQuery(bookmarkname,postalcode) {

    const data = {
      method: 'GET',
      url: '/bookmark',
      data : {'bookmarkname': bookmarkname, 'postalcode': postalcode}
    };

    $.ajax(data).done(res => {
      console.log(res);
    });
  };
  
});

console.log("Housing AJAX assets loaded");

