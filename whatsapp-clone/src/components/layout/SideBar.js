import { IconButton, Avatar } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchOutLined from '@material-ui/icons/SearchOutlined';

import React from 'react';
import './Sidebar.css';
import SidebarChat from './SidebarChat';
function SideBar() {
  return (
    <div className='sidebar'>
      <div className='sidebar__header'>
        <Avatar src='https://www.w3schools.com/w3images/avatar2.png' />
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
        <SidebarChat />
        <SidebarChat />
        <SidebarChat />
      </div>
    </div>
  );
}
export default SideBar;
