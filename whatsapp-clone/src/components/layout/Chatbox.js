import React from 'react';
import './Chatbox.css';
import { Avatar, IconButton } from '@material-ui/core';
import {
  AttachFile,
  SearchOutlined,
  MoreVert,
  InsertEmoticon,
} from '@material-ui/icons';
import Moment from 'react-moment';
function Chatbox() {
  return (
    <div className='chatbox'>
      <div className='chatbox__header'>
        <Avatar />
        <div className='chatbox__headerinfo'>
          <h3>Room name</h3>
          <p>
            Created on{' '}
            <Moment format='DD/MM/YY'>{new Date().toUTCString()}</Moment>
          </p>
        </div>
        <div className='chatbox__headerRight'>
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className='chatbox__body'>
        <p className='chat__message'>
          <span className='chat__name'>Anish</span>
          This is message
          <span className='chat__timestamp'>
            <Moment fromNow>{new Date().toUTCString()}</Moment>
          </span>
        </p>
        <p className='chat__message chat__reciever'>
          <span className='chat__name'>Anish</span>
          This is message
          <span className='chat__timestamp'>
            <Moment fromNow>{new Date().toUTCString()}</Moment>
          </span>
        </p>
        <p className='chat__message'>
          <span className='chat__name'>Anish</span>
          This is message
          <span className='chat__timestamp'>
            <Moment fromNow>{new Date().toUTCString()}</Moment>
          </span>
        </p>
      </div>
      <div className='chat__footer'>
        <IconButton>
          <InsertEmoticon />
        </IconButton>
        <form>
          <input placeholder='Type your message' type='text' />
        </form>
      </div>
    </div>
  );
}

export default Chatbox;
