import React from 'react';
import { Avatar, Button } from '@material-ui/core';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';
import './userSetting.css';
function UserSetting({ history, logout, isAuth }) {
  const goBackHandler = () => {
    history.push('/');
  };
  const logoutHandler = () => {
    logout();
  };
  if (!isAuth) {
    return <Redirect to='/login' />;
  }
  return (
    <div className='setting'>
      <div className='setting__body'>
        {/* header */}
        <div className='setting__header'>
          <Avatar />
          <div className='setting__headerRight'>
            <h2>Anish</h2>
            <h2>email</h2>
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
});

export default connect(mapper, { logout })(withRouter(UserSetting));
