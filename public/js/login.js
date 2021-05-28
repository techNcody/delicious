const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.querySelector('.logout-btn');
// const logoutBtnButtom = document.querySelector('.logout-btn-bottom');
const emailInput = document.getElementById('email');
const otpInput = document.getElementById('otp');
const getOtp = document.getElementById('get-otp');
const verifyOtp = document.getElementById('verify-otp');
const getOtpForm = document.querySelector('.getOtp-form');
const verifyOtpForm = document.querySelector('.verifyOtp-form');
const loggedInUser = document.querySelector('.loggedIn-user');

let userState = '';

if (verifyOtpForm) {
  verifyOtpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const otp = parseInt(otpInput.value);
    if (!otp) {
      return alert('Please enter you OTP');
    }
    login(otp, userState);
  });
}

const login = async (otp, userState) => {
  try {
    document.getElementById('login-loader').classList.remove('dl-hide-el');
    verifyOtp.disabled = true;

    const result = await axios({
      method: 'POST',
      url: '/api/v2/users/login',
      data: {
        otp,
        userState
      }
    });

    if (result.data.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/');
      }, 3000);
    } else {
      document.getElementById('login-loader').classList.add('dl-hide-el');
      verifyOtp.disabled = false;
      alert('Invalid OTP!!');
    }
  } catch (err) {
    document.getElementById('login-loader').classList.add('dl-hide-el');
    verifyOtp.disabled = false;
    alert('Invalid OTP!!');
    console.log(err);
  }
};

if (getOtpForm) {
  getOtpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value;
    userState = email;
    getOtpFn(email);
  });
}

async function getOtpFn(email) {
  try {
    document.getElementById('login-loader').classList.remove('dl-hide-el');
    const result = await axios({
      method: 'POST',
      url: '/api/v2/users/sendOtp',
      data: {
        email
      }
    });
    // console.log(result.data.data.status);
    if (result.data.data.status === 'success') {
      document.getElementById('login-loader').classList.add('dl-hide-el');
      alert('An OTP has been sent to your registered email id');
      getOtpForm.classList.add('dl-hide-el');
      verifyOtpForm.classList.remove('dl-hide-el');
    } else {
      document.getElementById('login-loader').classList.add('dl-hide-el');
      alert('This email is not registered.');
      // location.reload();
    }
  } catch (err) {
    alert('Invalid Email!!');
    console.log(err);
  }
}

function showAlert(msg, duration) {
  var el = document.createElement('div');
  el.setAttribute(
    'style',
    'position:absolute;top:35%;left:41%;background-color:white;color:black;font-weight:bold'
  );
  el.innerHTML = msg;
  setTimeout(function () {
    el.parentNode.removeChild(el);
  }, duration);
  document.body.appendChild(el);
}

const logout = async () => {
  const res = await axios('/api/v2/users/logout');
  if (res.data.status === 'success') {
    location.assign('/');
  } else {
    alert('Server error, please try again.');
  }
};

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    logout();
    // location.assign('/index.html');
  });
}

// $.ajax({
//   url: '/api/v2/users/sendOtp',
//   dataType: 'json',
//   type: 'Post',
//   async: true,
//   data: { email },
//   success: function (data) {
//     alert('An OTP has been sent to your registered email id');
//     console.log(data);
//     getOtpForm.classList.add('dl-hide-el');
//     verifyOtpForm.classList.remove('dl-hide-el');
//   },
//   error: function (xhr, exception, thrownError) {
//     var msg = '';
//     if (xhr.status === 0) {
//       msg = 'Not connect.\n Verify Network.';
//       console.log(xhr.responseText);
//     } else if (xhr.status == 404) {
//       msg = 'Requested page not found. [404]';
//     } else if (xhr.status == 500) {
//       msg = 'Internal Server Error [500].';
//     } else if (exception === 'parsererror') {
//       msg = 'Requested JSON parse failed.';
//     } else if (exception === 'timeout') {
//       msg = 'Time out error.';
//     } else if (exception === 'abort') {
//       msg = 'Ajax request aborted.';
//     } else {
//       msg = 'Error:' + xhr.status + ' ' + xhr.responseText;
//     }
//     alert(msg);
//   }
// });
