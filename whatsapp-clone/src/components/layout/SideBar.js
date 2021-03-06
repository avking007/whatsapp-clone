import { IconButton, Avatar, Menu, Fade, MenuItem } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchOutLined from '@material-ui/icons/SearchOutlined';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import './Sidebar.css';
import SidebarChat from './SidebarChat';
import { Redirect, withRouter } from 'react-router-dom';
import { logout } from '../../actions/auth';

function SideBar({
  user: {
    isAuth,
    user: { name, participant, _id },
    image,
    _v,
  },
  history,
  logout,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [Finder, setFinder] = useState('');

  if (!isAuth) {
    return <Redirect to='/login' />;
  }
  const LogoutHandler = () => {
    logout();
  };

  const newChatHandler = () => {
    history.push('/create_room');
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const SettingClickHandler = () => {
    history.push(`/${_id}/setting`);
  };
  const FindChats = (e) => {
    setFinder(e.target.value);
  };

  const SearchResults =
    Finder.length > 0 &&
    participant.map(
      (group) =>
        group.title.toLowerCase().includes(Finder) && (
          <SidebarChat key={group._id} room={group.room} title={group.title} />
        )
    );

  return (
    <div className='sidebar'>
      <div className='sidebar__header'>
        <Avatar src={`${image}?${_v}`} />
        <div className='sidebar__headerRight'>
          <IconButton onClick={newChatHandler}>
            <ChatIcon />
          </IconButton>

          <IconButton
            aria-controls='fade-menu'
            aria-haspopup='true'
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>

          <Menu
            id='fade-menu'
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <MenuItem className='menu__buttons' onClick={SettingClickHandler}>
              Settings
            </MenuItem>
            <MenuItem className='menu__buttons' onClick={LogoutHandler}>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
      <div className='sidebar__search'>
        <div className='sidebar__searchContainer'>
          <SearchOutLined />
          <input
            type='text'
            name=''
            id=''
            placeholder='Search'
            onChange={FindChats}
            value={Finder}
            autoComplete='off'
          />
        </div>
      </div>
      <div className='sidebar__chats'>
        {Finder.length > 0
          ? SearchResults
          : participant.map((group) => (
              <SidebarChat
                key={group._id}
                room={group.room}
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

export default connect(mapper, { logout })(withRouter(SideBar));
