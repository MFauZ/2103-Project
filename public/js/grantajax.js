$(() => {

  const $form = $('#grantajax');

  $form.on('submit', runGrant);

  // Get housing form data
  function runGrant(e) {
    e.preventDefault();

    const data = {
      method: 'POST',
      url: '/grant',
      data: $form.serialize()
    };

    $.ajax(data).done(res => {
      runGrantQuery(res.userPostal,res.parentPostal,res.marital);
    });
  };

  // Get SQL results and pin onto the map
  function runGrantQuery(userPostal,parentPostal,marital) {

    const data = {
      method: 'GET',
      url: '/grant',
      data : {'userPostal': userPostal,'parentPostal': parentPostal,'marital': marital}
    };

    $.ajax(data).done(res => {
      console.log(res);

      var eligibility = res['eligibility'];
      var grantCost = res['cost'];

      if (eligibility == 1){
        document.getElementById("eligibility").innerHTML = "Eligible!";
        document.getElementById("grantCost").innerHTML = "$" + grantCost;
        console.log("Eligible!");
      }
      else{
        document.getElementById("eligibility").innerHTML = "Ineligible!";
        document.getElementById("grantCost").innerHTML = "$0";
        console.log("Ineligible!");
      }


    });

    // //Clear map pins after being called
    // housingGroup.clearLayers();
  };
});

console.log("Grant AJAX assets loaded");

