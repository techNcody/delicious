const payBtn = document.getElementById('rzp-button');
var options = {
  key: 'rzp_test_8DuvnthMFg2vEm', // Enter the Key ID generated from the Dashboard
  name: 'Abhijit Biswas',
  order_id: 'order_HF8f24iAahKny7', // For one time payment
  //    subscription_id : "subscription.id", // For recurring subscription
  prefill: {
    name: 'Abhijit Biswas',
    email: 'abiswas391@gmail.com',
    contact: '7003930318'
  },
  theme: {
    color: '#3399cc'
  },
  // This handler function will handle the success payment
  handler: function (response) {
    alert(response.razorpay_payment_id);
    alert('Payment Successfull');
  }
};
var rzp1 = new Razorpay(options);
payBtn.onclick = function (e) {
  rzp1.open();
  e.preventDefault();
};
rzp1.on('payment.failed', function (response) {
  console.log(response.error.code);
  console.log(response.error.description);
  console.log(response.error.source);
  console.log(response.error.step);
  console.log(response.error.reason);
  console.log(response.error.metadata.order_id);
  console.log(response.error.metadata.payment_id);
});
