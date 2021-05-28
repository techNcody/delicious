$('.send-message-form').submit(function (e) {
  e.preventDefault();
  var form = $(this);
  var url = form.attr('action'); //get submit url [replace url here if desired]
  $('.send-message-form').find('.loading').slideDown();

  $.ajax({
    type: 'POST',
    url: url,
    data: form.serialize(), // serializes form input
    success: function (data) {
      console.log(data);
      $('.send-message-form').find('.loading').slideUp();
      // alert('Your have registered successfully..');
      $('.send-message-form').find('.sent-message').slideDown();
      window.setTimeout(function () {
        $('.send-message-form').find('.sent-message').slideUp();
      }, 3000);
      alert('You have been registered successfully.');
      location.assign('/login');
    },
    error: function (err) {
      console.log(err);
      alert('Some problem occured, please try again.');
      location.reload();
      //   $('.send-message-form').find('.error-message').slideDown();
      //   window.setTimeout(function () {
      //     $('.send-message-form').find('.error-message').slideUp();
      //   }, 3000);
    }
  });
});
