import React, { useState, useRef, useEffect, createRef } from 'react';
import './Chatbox.css';
import {
  Avatar,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from '@material-ui/core';
import { Picker } from 'emoji-mart';
import { connect } from 'react-redux';
import { SearchOutlined, MoreVert, InsertEmoticon } from '@material-ui/icons';
import MessageItem from './MessageItem';
import { sendMessage } from '../../actions/room';
import { Redirect, withRouter } from 'react-router-dom';
import { close_group, new_message } from '../../actions/room';
import 'emoji-mart/css/emoji-mart.css';

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
  _v,
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
  const [srch_message, setsrch_message] = useState('');
  const [mess, setmess] = useState({ user: '', message: '' });
  const [anchorEl, setanchorEl] = useState(null);
  const [searchEl, setsearchEl] = useState(null);
  const open = Boolean(anchorEl);
  const openSrch = Boolean(searchEl);
  const [emojiMenu, setemojiMenu] = useState(false);
  const search_ref = useRef();

  const stopPropagation = (e) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Home':
      case 'End':
        break;
      default:
        e.stopPropagation();
    }
  };

  const moveFocusToInput = (e) => {
    if (e.key === 'Tab' || e.key === 'ArrowRight') {
      e.stopPropagation();
      e.preventDefault();
      search_ref.current.focus();
    }
  };
  const toggleEmojiPicker = () => {
    setemojiMenu(!emojiMenu);
  };
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
    if (mess.user.length > 0) {
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
    sendMessage(mess, msgModel._id);
    setmess({ ...mess, message: '' });
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
    setsrch_message('');
    if (scrollFound.length > 0) {
      messageRef.current[
        scrollFound[(foundIdx - 1) % scrollFound.length]
      ].current.classList.remove('message__found');
    }
    setscrollFound([]);
    setfoundIdx(0);
    setflag(false);
  };
  // ----
  const [flag, setflag] = useState(false);
  const messageRef = useRef([]);

  // scroller to found message
  const scroller = (idx) => {
    messageRef.current[idx].current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    messageRef.current[idx].current.classList.add('message__found');
  };
  // search message
  const [scrollFound, setscrollFound] = useState([]);
  const [foundIdx, setfoundIdx] = useState(0);
  const scrollToMessage = (e) => {
    const search = srch_message;
    e.preventDefault();
    if (scrollFound.length === 0) {
      // prepare search if new search message
      const found = [];
      for (let i = 0; i < messages.length; i++) {
        if (messages[i].message.includes(search)) {
          found.push(i);
        }
      }
      setscrollFound(found);
    } else {
      // same previous search
      if (flag) {
        if (
          foundIdx % scrollFound.length !==
          (foundIdx - 1) % scrollFound.length
        ) {
          messageRef.current[
            scrollFound[(foundIdx - 1) % scrollFound.length]
          ].current.classList.remove('message__found');
        }
      }
      setflag(true);

      // scroll to it
      scroller(scrollFound[foundIdx % scrollFound.length]);

      let temp_c = foundIdx;
      setfoundIdx(temp_c + 1);
    }
  };

  // handle search message input
  const srchMessageChange = (e) => {
    setsrch_message(e.target.value);
    if (scrollFound.length > 0) {
      messageRef.current[
        scrollFound[foundIdx % scrollFound.length]
      ].current.classList.remove('message__found');
    }
    setscrollFound([]);
    setfoundIdx(0);
    setflag(false);
  };
  const addEmojitoMessage = (emoji) => {
    let new_mess = `${mess.message}${emoji.native}`;
    setmess({ ...mess, message: new_mess, user: user.name });
  };

  if (!isAuth) {
    return <Redirect to='/login' />;
  }
  const stringShortener = (arr) => {
    let str = '';
    for (let i = 0; i < arr.length; i++) {
      if (str.length > 16) {
        str += '...';
        break;
      }
      if (i !== arr.length - 1) {
        str += arr[i].name + ', ';
      } else {
        str += arr[i].name;
      }
    }
    return str;
  };
  return loading ? null : (
    <div className='chatbox'>
      <div className='chatbox__header'>
        <Avatar src={`/uploads/rooms/${room._id}.jpeg?${_v}`} />
        <div className='chatbox__headerinfo'>
          <h3>{room.title}</h3>
          <p>{room && room.members && stringShortener(room.members)}</p>
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
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem
              onKeyDown={moveFocusToInput}
              style={{ background: '#0f0f0f' }}
            >
              <form onSubmit={scrollToMessage} className='message_finder'>
                <TextField
                  autoComplete='off'
                  label='Finder'
                  variant='outlined'
                  value={srch_message}
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      color: '#d1d1d1',
                    },
                  }}
                  inputRef={search_ref}
                  onKeyDown={stopPropagation}
                  InputProps={{
                    style: {
                      color: '#d1d1d1',
                    },
                  }}
                  onChange={(e) => {
                    srchMessageChange(e);
                  }}
                />
              </form>
            </MenuItem>
          </Menu>
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
            <MenuItem className='menu__buttons' onClick={GroupSettinghandler}>
              Settings
            </MenuItem>
            <MenuItem onClick={groupCloseHandler} className='menu__buttons'>
              Close Group
            </MenuItem>
          </Menu>
        </div>
      </div>
      <div className='chatbox__body hidden_scroll'>
        {messages &&
          messages.map((mess, index) => (
            <MessageItem
              key={mess._id}
              msg={mess}
              inpRef={(messageRef.current[index] = createRef())}
            />
          ))}
        <div ref={scrollBottom} />
      </div>
      {emojiMenu && (
        <Picker
          showSkinTones={false}
          showPreview={false}
          defaultSkin='1'
          set='google'
          className='emoji-mart'
          onSelect={addEmojitoMessage}
          theme='dark'
          useButton={false}
        />
      )}
      <div className='chat__footer'>
        <IconButton onClick={toggleEmojiPicker}>
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
  _v: state.chats._v,
});

export default connect(mapper, { new_message, sendMessage, close_group })(
  withRouter(Chatbox)
);
