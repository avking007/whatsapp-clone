import React from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';

function MessageItem({ user, msg }) {
  const sender = user && user.user._id === msg.uid && 'chat__reciever';
  return (
    <p className={`chat__message${' ' + sender}`}>
      <span className='chat__name'>{msg.user}</span>
      {msg.message}
      <span className='chat__timestamp'>
        <Moment fromNow>{msg.date}</Moment>
      </span>
    </p>
  );
}

const mapper = (state) => ({
  user: state.user,
});

export default connect(mapper)(MessageItem);
