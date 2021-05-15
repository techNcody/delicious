const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
// const loginFormBtn = document.getElementById('login-form-btn');
const emailInput = document.getElementById('email');
const otpInput = document.getElementById('otp');
const getOtp = document.getElementById('get-otp');
const verifyOtp = document.getElementById('verify-otp');
const getOtpForm = document.querySelector('.getOtp-form');
const verifyOtpForm = document.querySelector('.verifyOtp-form');
const loggedInUser = document.querySelector('.loggedIn-user');

if (verifyOtpForm) {
  verifyOtpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const otp = parseInt(otpInput.value);
    console.log(otp);
    login(otp);
  });
}

const login = async (otp) => {
  try {
    const result = await axios({
      method: 'POST',
      url: '/api/v2/users/login',
      data: {
        otp
      }
    });
    console.log(result.data.data.status);

    if (result.data.data.status === 'success') {
      // console.log('logged in successfully');
      // showAlert('Logged in successfully', 1500);
      window.setTimeout(() => {
        location.assign('/home.html');
      }, 3000);
    } else {
      alert('Invalid OTP!!');
      // window.setTimeout(() => {
      //   location.assign('/');
      // }, 3000);
    }
  } catch (err) {
    showAlert('Incorrect email or password!!', 1500);
    console.log(err);
    // window.setTimeout(() => {
    //   location.assign('/login.html');
    // }, 3000);
  }
};

if (getOtpForm) {
  getOtpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value;
    console.log(email);
    getOtpFn(email);
  });
}

async function getOtpFn(email) {
  try {
    const result = await axios({
      method: 'POST',
      url: '/api/v2/users/sendOtp',
      data: {
        email
      }
    });
    alert('An OTP has been sent to your registered email id');
    console.log(result.data.data);
    getOtpForm.classList.add('dl-hide-el');
    verifyOtpForm.classList.remove('dl-hide-el');
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
