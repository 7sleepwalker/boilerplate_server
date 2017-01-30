import React, {Component} from 'react';
import Message from './Message';

import './style/MessageList.css';




export default class MessageList extends Component {

  componentDidMount(){
  }

  render() {
    return (
      <div className='chat-box__messages'>
        <h4> Conversation: </h4>
        {
          this.props.messages.map((message, i) => {
            return (
              <Message
                key={i}
                user={message.user}
                text={message.text}
              />
            );
          })
        }
      </div>
    );
  }

}
