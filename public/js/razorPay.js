const payBtn = document.getElementById('rzp-button');

if (payBtn) {
  payBtn.onclick = async function (e) {
    // console.log('clicked');
    const result = await axios('/api/v2/payments/createOrder');
    // console.log(result.data.data);

    const razorPay = {};

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
      handler: async function (response) {
        // console.log(response);
        // const subscription = await axios('/api/v2/subscription/createSubscription');
        await axios({
          method: 'post',
          url: '/api/v2/subscription/createSubscription',
          data: {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            requestId: result.data.request._id,
            status: 'paid'
          }
          // headers: {'Authorization': 'Bearer ...'}
        });
        // alert(`Your payment id is: ${response.razorpay_payment_id}`);
        alert('Your payment is completed Successfully');
        location.assign('/');

        // razorPay.paymentId = response.razorpay_payment_id;
        // razorPay.orderId = response.razorpay_order_id;
        // razorPay.signature = response.razorpay_signature;

        // for hashing the value with SHA256
        // var hash = CryptoJS.HmacSHA256(
        //   options.order_id + '|' + razorPay.paymentId,
        //   options.key
        // );
        // var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
        // document.write(hashInBase64);

        // const generated_signature = hash;
        // console.log(generated_signature);
        // console.log(razorPay.signature);
        // console.log(options.order_id);
        // console.log(razorPay.paymentId);
        // console.log(options.key);

        // if (generated_signature == razorPay.signature) {
        //   alert('Your payment is completed Successfully..');
        // }
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
