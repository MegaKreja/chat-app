import React, { Fragment } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import './AddRoom.css';

const AddRoom = props => {
  const {
    openInput,
    cancelAddingRoom,
    roomName,
    addRoom,
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
        className='addInput'
        onChange={changeRoomName}
        value={roomName}
        type='text'
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
