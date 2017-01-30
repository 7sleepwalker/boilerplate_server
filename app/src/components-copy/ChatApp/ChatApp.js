import React, {Component} from 'react';
import UsersList from './UsersList';
import MessageList from './MessageList';
import MessageForm from './MessageForm';

import './chat.css';


export default class Message extends Component {

  render() {
      return (
          <div>
              <UsersList
                  users={this.props.users}
              />
              <MessageList
                  messages={this.props.messages}
              />
              <MessageForm
                  onMessageSubmit={this.props.handleMessageSubmit}
                  user={this.props.user}
              />
          </div>
      );
  }
}
