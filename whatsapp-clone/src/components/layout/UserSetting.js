import React from 'react';
import { Avatar, Button, TextField } from '@material-ui/core';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';
import './userSetting.css';
function UserSetting({ history, logout, isAuth, user }) {
  const goBackHandler = () => {
    history.push('/');
  };
  const logoutHandler = () => {
    logout();
  };
  if (!isAuth) {
    return <Redirect to='/login' />;
  }

  const { name, email, image } = user;
  return (
    <div className='setting'>
      <div className='setting__body'>
        {/* header */}
        <div className='setting__header'>
          <Avatar src={image} />
          <div className='setting__headerRight'>
            <TextField
              value={name}
              label='Name'
              id='standard-read-only-input'
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              value={email}
              label='Email'
              id='standard-read-only-input'
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
          <Button onClick={goBackHandler}>Go Back</Button>
        </div>
        {/* settings */}
        <div className='setting__buttons'>
          <Button>Change DP</Button>
          <Button onClick={logoutHandler}>Logout </Button>
        </div>
      </div>
    </div>
  );
}
const mapper = (state) => ({
  isAuth: state.user.isAuth,
  user: state.user.user,
});

export default connect(mapper, { logout })(withRouter(UserSetting));
