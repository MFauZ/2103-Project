$(() => {

  const $form = $('#registerajax');

  $form.on('submit', runRegister);

  // Get housing form data
  function runRegister(e) {
    e.preventDefault();

    const data = {
      method: 'POST',
      url: '/register',
      data: $form.serialize()
    };

    $.ajax(data).done(res => {
      console.log(res);
      runHousingQuery(res.locale,res.year,res.room);
    });
  };
});

console.log("Housing AJAX assets loaded");

