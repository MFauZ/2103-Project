$(() => {

  var pathname = window.location.pathname;

  const $form = $('#housingajax');

  $("#checkAll").click(function () {
    console.log('Selected all')
    $('#housingajax input:checkbox').not(this).prop('checked', this.checked);
  });

  $form.on('submit', runHousing);

  // Get housing form data
  function runHousing(e) {
    e.preventDefault();

    const data = {
      method: 'POST',
      url: '/housing',
      data: $form.serialize()
    };

    $.ajax(data).done(res => {
      console.log(res);
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

      if (pathname =='/'){
        // Loop through contents of JSON query (Not login)
        for (i=0; i<res.length;i++){
            L.marker([res[i]['location']['coordinates'][1], res[i]['location']['coordinates'][0]], {icon: housingIcon}).bindPopup(popupContents("<b>Block "+res[i]['block']+"</b><p>Postal code:"+res[i]['postal_code']+"<br>Year built:"+res[i]['year']+"<br>Floors:"+res[i]['floors']+"<br>Room types:"+res[i]['rooms']+"</p>"),customOptions).addTo(housingGroup);
        }
      }
      else{
        // Loop through contents of JSON query (User login)
        for (i=0; i<res.length;i++){
            L.marker([res[i]['location']['coordinates'][1], res[i]['location']['coordinates'][0]], {icon: housingIcon}).bindPopup(popupContents("<b>Block "+res[i]['block']+"</b><p>Postal code:"+res[i]['postal_code']+"<br>Year built:"+res[i]['year']+"<br>Floors:"+res[i]['floors']+"<br>Room types:"+res[i]['rooms']+"</p>"+"<button class='btn search' id='bookmarkbtn' value='"+res[i]['id']+","+res[i]['block']+","+res[i]['postal_code']+"' onClick='runBookmarks(this.value)'>Bookmark this flat</button><br><button class='btn grantA' id='bookmarkbtn' value='"+res[i]['postal_code']+"' onClick='setgrantA(this.value)'>Mine</button><button class='btn grantB' id='bookmarkbtn' value='"+res[i]['postal_code']+"' onClick='setgrantB(this.value)'>Parents</button>"),customOptions).addTo(housingGroup);
        }
      }

    });

    //Clear map pins after being called
    housingGroup.clearLayers();
  };

  //Declare pop up content here
  function popupContents(string){
    return string;
  };

});

console.log("Housing AJAX assets loaded");

