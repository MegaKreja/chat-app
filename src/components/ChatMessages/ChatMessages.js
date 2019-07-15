import React, { Fragment } from 'react';
import './ChatMessages.css';

const ChatMessages = props => {
  const { username, messages } = props;
  const chatMessages = messages.map((msg, i) => {
    return (
      <Fragment key={i}>
        <div
          className={`messageInfo ${msg.username === username ? 'user' : ''}
      `}
        >
          <p>
            {msg.username !== username && msg.username + ','}{' '}
            {msg.date.split(' ')[1]}
          </p>
        </div>
        <div
          className={`chatMessage ${msg.username === username ? 'user' : ''}
      `}
        >
          <div
            className={`chatBubble ${msg.username === username ? 'user' : ''} ${
              msg.message.length > 35 ? 'long' : ''
            }
           `}
          >
            <h2>{msg.message}</h2>
          </div>
          <br />
        </div>
      </Fragment>
    );
  });

  return <div className='chatMessages'>{chatMessages}</div>;
};

export default ChatMessages;
