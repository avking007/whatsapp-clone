import React, { useState, useRef, useEffect } from 'react';
import './Chatbox.css';
import { Avatar, Fade, IconButton, Menu, MenuItem } from '@material-ui/core';
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
import { close_group } from '../../actions/room';

function Chatbox({
  room,
  messages,
  loading,
  user,
  sendMessage,
  isAuth,
  history,
  close_group,
}) {
  const scrollBottom = useRef();
  const scrollToBottom = () => {
    scrollBottom.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  useEffect(() => {
    if (messages) {
      scrollToBottom();
    }
  }, [messages]);
  const [mess, setmess] = useState({ user: '', message: '' });
  const [anchorEl, setanchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpen = (event) => {
    setanchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setanchorEl(null);
  };
  const groupCloseHandler = () => {
    close_group();
    handleClose();
  };
  const GroupSettinghandler = () => {
    history.push(`/${room._id}/room_setting`);
  };
  const changeHandler = (e) => {
    const sender = user && user.name;
    if (mess.user) {
      setmess({ ...mess, message: e.target.value });
    } else {
      setmess({ ...mess, message: e.target.value, user: sender });
    }
  };
  const SubmitHandler = (e) => {
    e.preventDefault();
    setmess({ ...mess, message: '' });
    sendMessage(mess, messages._id);
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
          <IconButton>
            <SearchOutlined />
          </IconButton>
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
          messages.msg_contents &&
          messages.msg_contents.map((mess) => (
            <MessageItem key={mess._id} msg={mess} />
          ))}
        <div ref={scrollBottom}></div>
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
  messages: state.chats.msg_model,
  loading: state.chats.loading,
  user: state.user.user,
  isAuth: state.user.isAuth,
});

export default connect(mapper, { sendMessage, close_group })(
  withRouter(Chatbox)
);
