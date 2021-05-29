const payBtn = document.getElementById('rzp-button');

if (payBtn) {
  payBtn.onclick = async function (e) {
    console.log('clicked');
    const result = await axios('/api/v2/payments/createOrder');
    console.log(result.data.data);

    const options = {
      key: 'rzp_test_8DuvnthMFg2vEm', // Enter the Key ID generated from the Dashboard
      name: result.data.user.name,
      order_id: result.data.data.id, // For one time payment
      //    subscription_id : "subscription.id", // For recurring subscription
      prefill: {
        name: result.data.user.name,
        email: result.data.user.email,
        contact: result.data.user.mobileNumber
      },
      theme: {
        color: '#ffa012'
      },
      // This handler function will handle the success payment
      handler: function (response) {
        alert(`Your payment id is: ${response.razorpay_payment_id}`);
        alert('Your payment is completed Successfully');
      }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function (response) {
      console.log(response.error.code);
      console.log(response.error.description);
      console.log(response.error.source);
      console.log(response.error.step);
      console.log(response.error.reason);
      console.log(response.error.metadata.order_id);
      console.log(response.error.metadata.payment_id);
    });
  };
}
