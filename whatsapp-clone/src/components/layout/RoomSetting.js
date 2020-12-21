import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import './roomSetting.css';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { add_member, group_image } from '../../actions/room';

function RoomSetting({ room, isAuth, history, add_member, group_image, _v }) {
  const goBackHandler = () => {
    localStorage.clear();
    history.push('/');
  };
  const [members, setmembers] = useState([]);

  useEffect(() => {
    if (room) {
      setmembers(room.members);
    } else {
      setmembers([]);
    }
  }, [room]);

  const [newMem, setnewMem] = useState({ email: '' });
  const [showMem, setshowMem] = useState(false);
  const [dpMenu, setdpMenu] = useState(false);
  const [groupDP, setgroupDP] = useState({ file: null });
  const toggleDPMenu = () => {
    setdpMenu(!dpMenu);
  };
  if (!isAuth) {
    return <Redirect to='/login' />;
  }
  const addMemberHandler = (e) => {
    setnewMem({ email: e.target.value });
  };
  const addMemberSubmit = async (e) => {
    e.preventDefault();
    await add_member(room._id, newMem.email);
    setnewMem({ email: '' });
    setmembers([...members]);
    toggleMemberBox();
  };
  const toggleMemberBox = () => {
    setshowMem(!showMem);
  };
  const ImageSubmitHandler = (e) => {
    e.preventDefault();
    if (groupDP.file) {
      group_image(room._id, groupDP.file);
    }
    setgroupDP({ file: null });
    toggleDPMenu();
  };
  const addImageHandler = (file) => {
    setgroupDP({ file: file });
  };
  const { title, desc } = room;
  return (
    <div className='room_setting'>
      <div className='room_setting__body'>
        {/* header */}
        <div className='room_setting__header'>
          <Avatar src={`/uploads/rooms/${room._id}.jpeg?${_v}`} />

          <div className='room_setting__headerRight'>
            <h2>{title}</h2>
            {desc && (
              <TextField
                value={desc}
                label='Description'
                id='standard-read-only-input'
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
          </div>
          <Button onClick={goBackHandler}>Go Back</Button>
        </div>
        {/* settings */}
        <div className='room_setting__buttons'>
          <Button onClick={toggleDPMenu}>Change DP</Button>
          <Dialog
            open={dpMenu}
            onClose={toggleDPMenu}
            aria-labelledby='responsive-dialog-title'
          >
            <DialogContent>
              <DialogContentText>
                <strong>Add Group Image</strong>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <form onSubmit={ImageSubmitHandler} className='image_form'>
                <TextField
                  required
                  name='file'
                  variant='outlined'
                  id='standard-full-width'
                  label='Add image'
                  InputLabelProps={{
                    shrink: true,
                  }}
                  type='file'
                  onChange={(e) => {
                    addImageHandler(e.target.files);
                  }}
                />
                <Button type='submit'>Upload</Button>
              </form>
            </DialogActions>
          </Dialog>
          <Button onClick={toggleMemberBox}>Add Member </Button>
          <Dialog
            open={showMem}
            onClose={toggleMemberBox}
            aria-labelledby='responsive-dialog-title'
          >
            <DialogContent>
              <DialogContentText>
                <strong>Add new member</strong>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <form onSubmit={addMemberSubmit}>
                <TextField
                  required
                  name='email'
                  value={newMem.email}
                  label='Email'
                  variant='outlined'
                  id='outlined-basic'
                  autoComplete='off'
                  type='email'
                  onChange={(e) => {
                    addMemberHandler(e);
                  }}
                />
              </form>
            </DialogActions>
          </Dialog>
        </div>
        <div className='room__members '>
          <div className='room__membersHeader'>
            <h2>MEMBERS</h2>
          </div>
          <div className='room__memberBody hidden_scroll'>
            {members.map((member) => (
              <div key={member._id} className='room__member'>
                <Avatar src={`/uploads/users/${member.user}.jpeg`} />
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
  _v: state.chats._v,
});

export default connect(mapper, { add_member, group_image })(
  withRouter(RoomSetting)
);
