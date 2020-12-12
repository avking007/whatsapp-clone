import { IconButton, Avatar } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchOutLined from '@material-ui/icons/SearchOutlined';
import React from 'react';
import { connect } from 'react-redux';
import './Sidebar.css';
import SidebarChat from './SidebarChat';
import { Redirect } from 'react-router-dom';
function SideBar({
  user: {
    isAuth,
    user: { image, name, participant },
  },
}) {
  if (!isAuth) {
    return <Redirect to='/login' />;
  }
  return (
    <div className='sidebar'>
      <div className='sidebar__header'>
        <Avatar src={image} />
        <div className='sidebar__headerRight'>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className='sidebar__search'>
        <div className='sidebar__searchContainer'>
          <SearchOutLined />
          <input type='text' name='' id='' placeholder='Search' />
        </div>
      </div>
      <div className='sidebar__chats'>
        {participant.map((group) => (
          <SidebarChat
            key={group._id}
            room={group.room}
            img={group.grp_img}
            title={group.title}
          />
        ))}
      </div>
    </div>
  );
}

const mapper = (state) => ({
  user: state.user,
});

export default connect(mapper)(SideBar);
