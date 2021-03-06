import React, { Fragment } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import './AddRoom.css';

const AddRoom = props => {
  const {
    openInput,
    cancelAddingRoom,
    roomName,
    addRoom,
    addRoomKeyPress,
    changeRoomName,
    addingRoom
  } = props;

  const addBtn = (
    <div onClick={openInput} className='addBtn'>
      +
    </div>
  );

  const addInput = (
    <div className='addFormInput'>
      <input
        placeholder='Add a room...'
        className='addInput'
        onChange={changeRoomName}
        onKeyPress={addRoomKeyPress}
        value={roomName}
        type='text'
        autoFocus
      />
      <div className='addButtons'>
        <div className='btnOk inline' onClick={addRoom}>
          <FaCheck />
        </div>
        <div className='btnCancel inline' onClick={cancelAddingRoom}>
          <FaTimes />
        </div>
      </div>
    </div>
  );

  const result = addingRoom ? addInput : addBtn;

  return <Fragment>{result}</Fragment>;
};

export default AddRoom;
