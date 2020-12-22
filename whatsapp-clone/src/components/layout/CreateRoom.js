import React, { useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import './createRoom.css';
import { create_group } from '../../actions/room';
import { connect } from 'react-redux';

function CreateRoom({ isAuth, history, create_group }) {
  const goBackHandler = () => {
    history.push('/');
  };
  const [group, setgroup] = useState({ title: '', desc: '' });
  const [groupDP, setgroupDP] = useState({ file: null });
  const submitHandler = (e) => {
    e.preventDefault();
    create_group({ group_details: group, group_DP: groupDP.file });
    history.push('/');
  };
  const changeHandler = (e) => {
    setgroup({ ...group, [e.target.name]: e.target.value });
  };
  const DPchangeHandler = (file) => {
    setgroupDP({ file: file });
  };
  if (!isAuth) {
    history.push('/login');
  }
  return (
    <div className='app'>
      <div className='app__body'>
        <div className='create_room'>
          <div className='create__roomHeader'>
            <h2>Create Room</h2>
          </div>
          <form
            className='create__roomForm'
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <TextField
              required
              name='title'
              value={group.title}
              label='Group Name'
              variant='outlined'
              id='standard-basic'
              autoComplete='off'
              onChange={(e) => {
                changeHandler(e);
              }}
              InputLabelProps={{
                style: {
                  color: '#d1d1d1',
                },
              }}
              inputProps={{
                style: {
                  color: '#d1d1d1',
                },
              }}
            />
            <TextField
              value={group.desc}
              name='desc'
              label='Description'
              variant='outlined'
              id='outlined-basic'
              autoComplete='off'
              onChange={(e) => {
                changeHandler(e);
              }}
              InputLabelProps={{
                style: {
                  color: '#d1d1d1',
                },
                className: {
                  color: 'white',
                },
              }}
              inputProps={{
                style: {
                  color: '#d1d1d1',
                },
              }}
            />
            <TextField
              variant='outlined'
              id='standard-full-width'
              label='Add image'
              InputLabelProps={{
                shrink: true,
                style: {
                  color: '#d1d1d1',
                },
              }}
              inputProps={{
                style: {
                  color: '#d1d1d1',
                },
              }}
              type='file'
              onChange={(e) => {
                DPchangeHandler(e.target.files);
              }}
            />
            <Button type='submit'>Create Group</Button>
          </form>
          <Button onClick={goBackHandler}>Go Back</Button>
        </div>
      </div>
    </div>
  );
}
export const mapper = (state) => ({
  isAuth: state.user.isAuth,
});
export default connect(mapper, { create_group })(withRouter(CreateRoom));
