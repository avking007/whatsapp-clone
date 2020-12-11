import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import SideBar from '../layout/SideBar';
import Chatbox from '../layout/Chatbox';

function Landing({ isAuth }) {
  if (!isAuth) {
    return <Redirect to='/login' />;
  }
  return (
    <div className='app'>
      <div className='app__body'>
        <SideBar />
        <Chatbox />
      </div>
    </div>
  );
}

const mapper = (state) => ({
  isAuth: state.user.isAuth,
});

export default connect(mapper)(Landing);
