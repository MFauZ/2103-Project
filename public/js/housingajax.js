$(() => {
  const $form = $('#housingajax');

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

      performTask(res,50,function(items,index){
      console.log(items[index]);

      $('body').append('<a id="marker_' + index + '" href="#">Marker ' + index + '</a><br>');

      // Mark the locations on map
      markers.push(L.marker([items[index].latitude,items[index].longitude],{title:'marker_' + index + ''}).addTo(layerGroup).bindPopup(items[index].id));
      });
    });
    //Clear map pins after being called
    layerGroup.clearLayers();
  };

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
  };
});

console.log("Housing AJAX assets loaded");

