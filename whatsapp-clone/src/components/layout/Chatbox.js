import React, { useState, useRef, useEffect } from 'react';
import './Chatbox.css';
import {
  Avatar,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from '@material-ui/core';
import { connect } from 'react-redux';
import {
  AttachFile,
  SearchOutlined,
  MoreVert,
  InsertEmoticon,
} from '@material-ui/icons';
import Moment from 'react-moment';
import MessageItem from './MessageItem';
import { sendMessage } from '../../actions/room';
import { Redirect, withRouter } from 'react-router-dom';
import { close_group, new_message } from '../../actions/room';

import Pusher from 'pusher-js';
function Chatbox({
  room,
  messages,
  loading,
  user,
  sendMessage,
  isAuth,
  history,
  msgModel,
  close_group,
  new_message,
}) {
  const scrollBottom = useRef();
  const scrollToBottom = () => {
    scrollBottom.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);
  // console.log(messages);
  const [srch_message, setsrch_message] = useState('');
  const [mess, setmess] = useState({ user: '', message: '' });
  const [anchorEl, setanchorEl] = useState(null);
  const [searchEl, setsearchEl] = useState(null);
  const open = Boolean(anchorEl);
  const openSrch = Boolean(searchEl);

  // --------
  // setting menu toggle
  const handleOpen = (event) => {
    setanchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setanchorEl(null);
  };
  // --------

  // --------
  // close currently open group
  const groupCloseHandler = () => {
    close_group();
    handleClose();
  };
  // --------

  const GroupSettinghandler = () => {
    history.push(`/${room._id}/room_setting`);
  };
  // --------
  // message input handle
  const changeHandler = (e) => {
    const sender = user && user.name;
    if (mess.user) {
      setmess({ ...mess, message: e.target.value });
    } else {
      setmess({ ...mess, message: e.target.value, user: sender });
    }
  };
  // --------

  // ------
  // send message
  const SubmitHandler = (e) => {
    e.preventDefault();
    setmess({ ...mess, message: '' });
    sendMessage(mess, msgModel._id);
  };

  useEffect(() => {
    const pusher = new Pusher('59140e79370d6491a60f', {
      cluster: 'ap2',
    });

    const channel = pusher.subscribe('messages');
    channel.bind('updated', function (newMessage) {
      if (room) {
        new_message(newMessage, room.messageModel, user._id);
      }
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [room, new_message, user]);

  //-------

  // ---
  // Search message menu toggle
  const handleSearchOpen = (e) => {
    setsearchEl(e.currentTarget);
  };
  const handleSearchClose = () => {
    setsearchEl(null);
  };
  // ----

  // search message
  const SearchMessage = () => {};

  // handle search message input
  const srchMessageChange = (e) => {
    setsrch_message(e.target.value);
  };
  if (!isAuth) {
    return <Redirect to='/login' />;
  }

  return loading ? null : (
    <div className='chatbox'>
      <div className='chatbox__header'>
        <Avatar src={`/uploads/rooms/${room._id}.jpeg?${Date.now()}`} />
        <div className='chatbox__headerinfo'>
          <h3>{room.title}</h3>
          <p>
            Created on <Moment format='DD/MM/YY'>{room.date}</Moment>
          </p>
        </div>
        <div className='chatbox__headerRight'>
          <IconButton
            aria-controls='fade-menu'
            aria-haspopup='true'
            onClick={handleSearchOpen}
          >
            <SearchOutlined />
          </IconButton>
          <Menu
            id='fade-menu'
            anchorEl={searchEl}
            keepMounted
            open={openSrch}
            onClose={handleSearchClose}
            getContentAnchorEl={null}
            TransitionComponent={Fade}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <MenuItem>
              <form onSubmit={SearchMessage}>
                <TextField
                  autoComplete='off'
                  label='Search message'
                  variant='outlined'
                  value={srch_message}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => srchMessageChange(e)}
                />
              </form>
            </MenuItem>
          </Menu>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton
            aria-controls='fade-menu'
            aria-haspopup='true'
            onClick={handleOpen}
          >
            <MoreVert />
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
            <MenuItem onClick={GroupSettinghandler}>Settings</MenuItem>
            <MenuItem onClick={groupCloseHandler}>Close Group</MenuItem>
          </Menu>
        </div>
      </div>
      <div className='chatbox__body hidden_scroll'>
        {messages &&
          messages.map((mess) => <MessageItem key={mess._id} msg={mess} />)}
        <div ref={scrollBottom} />
      </div>
      <div className='chat__footer'>
        <IconButton>
          <InsertEmoticon />
        </IconButton>
        <form
          onSubmit={(e) => {
            SubmitHandler(e);
          }}
        >
          <input
            autoComplete='off'
            placeholder='Type your message'
            type='text'
            name='message'
            value={mess.message}
            onChange={(e) => {
              changeHandler(e);
            }}
          />
        </form>
      </div>
    </div>
  );
}

export const mapper = (state) => ({
  room: state.chats.room,
  messages: state.chats.messages,
  loading: state.chats.loading,
  user: state.user.user,
  isAuth: state.user.isAuth,
  msgModel: state.chats.msg_model,
});

export default connect(mapper, { new_message, sendMessage, close_group })(
  withRouter(Chatbox)
);
