import React, { useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import './createRoom.css';
import { create_group } from '../../actions/room';
import { connect } from 'react-redux';

function CreateRoom({ history, create_group }) {
  const goBackHandler = () => {
    history.push('/');
  };
  const [group, setgroup] = useState({ title: '', desc: '', img: '' });
  const submitHandler = (e) => {
    e.preventDefault();
    create_group(group);
    history.push('/');
  };
  const changeHandler = (e) => {
    setgroup({ ...group, [e.target.name]: e.target.value });
  };
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
              id='outlined-basic'
              autoComplete='off'
              onChange={(e) => {
                changeHandler(e);
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
            />
            <TextField
              name='img'
              value={group.img}
              variant='outlined'
              id='standard-full-width'
              label='Add image'
              InputLabelProps={{
                shrink: true,
              }}
              type='file'
              onChange={(e) => {
                changeHandler(e);
              }}
            />
            <Button type='file'>Create Group</Button>
          </form>
          <Button onClick={goBackHandler}>Go Back</Button>
        </div>
      </div>
    </div>
  );
}

export default connect(null, { create_group })(withRouter(CreateRoom));
