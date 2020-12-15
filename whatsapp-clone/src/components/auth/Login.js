import React from 'react';
import './login.css';
import GoogleLogin from 'react-google-login';
import { connect } from 'react-redux';
import { google_succ, google_fail } from '../../actions/auth';
import { Redirect } from 'react-router-dom';
import Logo from '../../style_img/WhatsApp-Logo.png';

function Login({ google_succ, google_fail, isAuth }) {
  const responseSuccessGoogle = async (success) => {
    const tokenId = success.tokenId;
    const img = success.profileObj.imageUrl;
    google_succ(tokenId, img);
  };
  const responseErrorGoogle = (error) => {
    alert('Oops!!..Something went wrong!');
    google_fail();
  };
  if (isAuth) {
    return <Redirect to='/' />;
  }
  return (
    <div className='login'>
      <div className='login__container'>
        <img src={Logo} alt='' />
        <div className='login_text'>
          <h2>Login to whatsapp</h2>
        </div>
        <GoogleLogin
          clientId='699625891152-llvk17ddp5otqeqc1076gcid8ipidtsr.apps.googleusercontent.com'
          buttonText='Login with Google'
          onSuccess={responseSuccessGoogle}
          onFailure={responseErrorGoogle}
          cookiePolicy={'single_host_origin'}
        />
      </div>
    </div>
  );
}
const mapper = (state) => ({
  isAuth: state.user.isAuth,
});

export default connect(mapper, { google_fail, google_succ })(Login);
