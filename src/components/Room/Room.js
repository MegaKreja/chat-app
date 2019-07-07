import React from 'react';
import _ from 'lodash';
import './Room.css';
import { FaTrashAlt } from 'react-icons/fa';

const Room = props => {
  const { name, user, color } = props.room;

  return (
    <div className='room'>
      <div className='avatar inline' style={{ backgroundColor: color }} />
      <h1 className='inline roomNameHeader'>{name}</h1>
      {_.isEqual(props.loggedUser, user) && (
        <div className='inline deleteBtn' onClick={props.deleteRoom}>
          <FaTrashAlt className='deleteIcon' />
        </div>
      )}
    </div>
  );
};

export default Room;
