import React, { Fragment } from 'react';
import './ChatMessages.css';

const ChatMessages = props => {
  let typingInfo = null;
  const { username, messages, typing } = props;
  console.log(typing);
  const chatMessages = messages.map((msg, i) => {
    return (
      <Fragment key={i}>
        <div
          className={`messageInfo ${msg.username === username ? 'user' : ''}
      `}
        >
          <p>
            {msg.username !== username && msg.username + ','} {msg.date}
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

  if (typing) {
    typingInfo = typing.map((user, i) => {
      return (
        <p className='typing' key={i}>
          {user} is typing...
        </p>
      );
    });
  }

  return (
    <div id='list' className='chatMessages'>
      {chatMessages}
      {typingInfo ? typingInfo : ''}
    </div>
  );
};

export default ChatMessages;
