import React, {Component} from 'react';
import UsersList from './UsersList';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import ChangeNameForm from './ChangeNameForm';

import './chat.css';

import $ from "jquery";
import cookie from 'react-cookie';
import io from 'socket.io-client';

// s
var socket = io.connect();

export default class Message extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nickName: cookie.load('nickName'),
            users: [],
            messages: [],
            text: ''
        }
        this._initialize = this._initialize.bind(this);
        this._messageRecieve = this._messageRecieve.bind(this);
        this._userJoined = this._userJoined.bind(this);
        this._userLeft = this._userLeft.bind(this);
        this._userChangedName = this._userChangedName.bind(this);
        this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);

    }


  componentDidMount() {

      socket.on('init', this._initialize);
      socket.on('send:message', this._messageRecieve);
      socket.on('user:join', this._userJoined);
      socket.on('user:left', this._userLeft);
      socket.on('change:name', this._userChangedName);
      socket.emit('logIn_PUNS', { name : this.state.nickName, users: this.state.users}, (result) => {
          if (this.state.users.length === 1){
              $('body').addClass('emptyRoom');
          }
          else if(this.state.users.length === 2){
              $('body').addClass('gamingRoom');
              socket.emit('chooseArtist', this.state.users, (result) => {
                  if(this.state.nickName === result){
                        $('body').addClass('drawingMode');
                  }
                  else{
                      $('body').removeClass('drawingMode');
                  }
              });
          }
          else{
              $('body').addClass('gamingRoom');
          }
      });


  }

  _initialize(data) {
      var {users, name} = data;
      this.setState({users, user: name});
  }

  _messageRecieve(message) {
      var {messages} = this.state;
      messages.push(message);
      this.setState({messages});
  }

  _userJoined(data) {

      var {users, messages} = this.state;
      var {name} = data;
      users.push(name);
      messages.push({
          user: 'APPLICATION BOT',
          text : name +' Joined'
      });
      this.setState({users, messages});
      if ($('body').hasClass('emptyRoom')){
          $('body').removeClass('emptyRoom').addClass('gamingRoom');
      }

  }

  _userLeft(data) {
      var {users, messages} = this.state;
      var {name} = data;
      var index = users.indexOf(name);
      users.splice(index, 1);
      messages.push({
          user: 'APPLICATION BOT',
          text : name +' Left'
      });
      this.setState({users, messages});
      if (data.emptyRoom){
          $('body').removeClass('gamingRoom').addClass('emptyRoom');
      }
  }

  _userChangedName(data) {
      var {oldName, newName} = data;
      var {users, messages} = this.state;
      var index = users.indexOf(oldName);
      users.splice(index, 1, newName);
      messages.push({
          user: 'APPLICATION BOT',
          text : 'Change Name : ' + oldName + ' ==> '+ newName
      });
      this.setState({users, messages});
  }

  handleMessageSubmit(message) {
      console.log("Handle message sumbit: "+message);
      var {messages} = this.state;
      messages.push(message);
      this.setState({messages});
      socket.emit('send:message', message);
  }

  handleChangeName(newName) {
      console.log(" ### CHANGE NAME ### ");
      var oldName = this.state.user;
      socket.emit('change:name', { name : newName}, (result) => {
          console.log(" ### RESULT FUNCTION ### ");
          if(!result) {
              return alert('There was an error changing your name');
          }
          var {users} = this.state;
          var index = users.indexOf(oldName);
          users.splice(index, 1, newName);
          this.setState({users, user: newName});
          console.log(newName);
      });
  }

  render() {
      return (
          <div>
              <UsersList
                  users={this.state.users}
              />
              <MessageList
                  messages={this.state.messages}
              />
              <MessageForm
                  onMessageSubmit={this.handleMessageSubmit}
                  user={this.state.user}
              />
              <ChangeNameForm
                  onChangeName={this.handleChangeName}
              />
          </div>
      );
  }
}
