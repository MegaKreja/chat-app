import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import './Room.css';
import { FaTrashAlt } from 'react-icons/fa';

const Room = props => {
  const { _id, name, user, color } = props.room;

  return (
    <Link
      to={{
        pathname: `/chat/${_id}`,
        state: {
          room: props.room
        }
      }}
    >
      <div className='room'>
        <div className='avatar inline' style={{ backgroundColor: color }} />
        <h1 className='inline roomNameHeader'>{name}</h1>
        {/* <Link to='/'> */}
        {_.isEqual(props.loggedUser, user) && (
          <div className='inline deleteBtn' onClick={props.deleteRoom}>
            <FaTrashAlt className='deleteIcon' />
          </div>
        )}
        {/* </Link> */}
      </div>
    </Link>
  );
};

export default Room;
