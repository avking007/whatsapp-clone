import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from '@material-ui/core';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout, add_image } from '../../actions/auth';
import './userSetting.css';

function UserSetting({ history, logout, isAuth, user, add_image, user_image }) {
  const [dispImage, setdispImage] = useState('/' + user_image);

  const [dpmenu, setdpmenu] = useState(false);
  const [image, setimage] = useState({ file: null });
  const goBackHandler = () => {
    history.push('/');
  };
  const logoutHandler = () => {
    logout();
  };
  if (!isAuth) {
    return <Redirect to='/login' />;
  }
  const dpToggler = () => {
    setdpmenu(!dpmenu);
  };
  const addImage = (file) => {
    setimage({ file: file });
  };
  const dpSubmitHandler = (e) => {
    // e.preventDefault();
    if (image.file) {
      add_image(user._id, image.file);
      // setdispImage('/' + user_image);
    }
    setimage({ file: null });
    dpToggler();
  };

  const { name, email } = user;
  return (
    <div className='setting'>
      <div className='setting__body'>
        {/* header */}
        <div className='setting__header'>
          <Avatar src={dispImage} />
          <div className='setting__headerRight'>
            <TextField
              value={name}
              label='Name'
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              value={email}
              label='Email'
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
          <Button onClick={goBackHandler}>Go Back</Button>
        </div>
        {/* settings */}
        <div className='setting__buttons'>
          <Button onClick={dpToggler}>Change DP</Button>
          <Dialog
            open={dpmenu}
            onClose={dpToggler}
            aria-labelledby='responsive-dialog-title'
          >
            <DialogContent>
              <DialogContentText>
                <strong>Upload Image</strong>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <form onSubmit={dpSubmitHandler} className='image_form'>
                <TextField
                  required
                  name='email'
                  variant='outlined'
                  id='outlined-basic'
                  type='file'
                  InputProps={{
                    readOnly: true,
                  }}
                  onChange={(e) => {
                    addImage(e.target.files);
                  }}
                />
                <Button type='submit'>Upload</Button>
              </form>
            </DialogActions>
          </Dialog>
          <Button onClick={logoutHandler}>Logout </Button>
        </div>
      </div>
    </div>
  );
}
const mapper = (state) => ({
  isAuth: state.user.isAuth,
  user: state.user.user,
  user_image: state.user.image,
});

export default connect(mapper, { logout, add_image })(withRouter(UserSetting));
