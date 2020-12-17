import { Avatar } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import './sidebarchat.css';
import { open_room } from '../../actions/room';

function SidebarChat({ room, img, title, open_room, key }) {
  const roomClickHandler = (roomId) => {
    open_room(roomId);
  };
  return (
    <div className='sidebarChat' onClick={(e) => roomClickHandler(room)}>
      <Avatar src={`/uploads/rooms/${room}.jpeg`} />
      <div className='sidebarChat__info'>
        <h2>{title}</h2>
      </div>
    </div>
  );
}

export default connect(null, { open_room })(SidebarChat);
