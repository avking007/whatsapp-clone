import { Avatar, Button } from '@material-ui/core';
import React from 'react';
import './roomSetting.css';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

function RoomSetting({ room, isAuth, history }) {
  const goBackHandler = () => {
    localStorage.clear();
    history.push('/');
  };
  const loadDefaults = (room, isAuth) => {
    let rom = JSON.parse(localStorage.getItem('room'));
    let auth = JSON.parse(localStorage.getItem('isAuth'));
    return { room: rom, isAuth: auth };
  };
  const StoreDefaults = (room, isAuth) => {
    localStorage.setItem('room', JSON.stringify(room));
    localStorage.setItem('isAuth', JSON.stringify(isAuth));
  };
  if (!room || !isAuth) {
    const res = loadDefaults(room, isAuth);
    room = res.room;
    isAuth = res.isAuth;
  } else {
    StoreDefaults(room, isAuth);
  }

  if (!isAuth) {
    return <Redirect to='/login' />;
  }
  const { image, title, members, desc } = room;
  return (
    <div className='room_setting'>
      <div className='room_setting__body'>
        {/* header */}
        <div className='room_setting__header'>
          <Avatar src={image} />
          <div className='room_setting__headerRight'>
            <h2>{title}</h2>
            <h2>{desc}</h2>
          </div>
          <Button onClick={goBackHandler}>Go Back</Button>
        </div>
        {/* settings */}
        <div className='room_setting__buttons'>
          <Button>Change DP</Button>
          <Button>Add Member </Button>
        </div>
        <div className='room__members '>
          <div className='room__membersHeader'>
            <h2>MEMBERS</h2>
          </div>
          <div className='room__memberBody hidden_scroll'>
            {members.map((member) => (
              <div key={member._id} className='room__member'>
                <Avatar src={member.image} />
                <h3>{member.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
const mapper = (state) => ({
  room: state.chats.room,
  isAuth: state.user.isAuth,
});

export default connect(mapper)(withRouter(RoomSetting));
