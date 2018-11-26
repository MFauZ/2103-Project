$(() => {

  const $form = $('#loginajax');

  $form.on('submit', runRegister);

  // Get housing form data
  function runRegister(e) {
    //e.preventDefault();

    const data = {
      method: 'POST',
      url: '/login',
      data: $form.serialize()
    };

    $.ajax(data).done(res => {
      console.log(res);
    });
  };
});

console.log("Login AJAX assets loaded");

