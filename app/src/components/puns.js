import React, {Component} from 'react';

import "tracking";
import './style/puns.css';
import ChatApp from './ChatApp/ChatApp';
// require("../scripts/puns.js");

import $ from "jquery";
import cookie from 'react-cookie';


if (typeof window.orientation === 'undefined') {

};
var trackColor = require("../scripts/splines.min.js");
var tracker = new window.tracking.ColorTracker(['magenta', 'cyan']);

var video;
var canvas;
var context;

var drawSegments = [[]];
var segment = 0;
console.log(tracker);

function updateScroll(){
  $('.chat-box__messages').animate({ scrollTop: $('.chat-box__messages').height() }, 100);
}

export default class Puns extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nickName: cookie.load('nickName'),
      users: [],
      messages: [],
      text: '',
      drawing: ''
    }
    this._track = this._track.bind(this);
    this._initialize = this._initialize.bind(this);
    this._messageRecieve = this._messageRecieve.bind(this);
    this._userJoined = this._userJoined.bind(this);
    this._userLeft = this._userLeft.bind(this);
    this._userChangedName = this._userChangedName.bind(this);
    this._newDrawing = this._newDrawing.bind(this);
    this._userScored = this._userScored.bind(this);
    this._drawRect = this._drawRect.bind(this);
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
  }

  componentDidMount() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    console.log('mount');

    tracker.on('track', this._track);
    this.props.socket.on('init', this._initialize);
    this.props.socket.on('send:message', this._messageRecieve);
    this.props.socket.on('user:join', this._userJoined);
    this.props.socket.on('user:left', this._userLeft);
    this.props.socket.on('change:name', this._userChangedName);
    this.props.socket.on('new:drawing', this._newDrawing)
    this.props.socket.on('user:scored', this._userScored);
    this.props.socket.on('get:rect', this._drawRect);
    this.props.socket.on('logIn_PUNS', () => {
      if (this.state.users.length === 1) {
        $('body').addClass('emptyRoom');
      } else if (this.state.users.length === 2) {
        $('body').addClass('gamingRoom');
        this.props.socket.emit('chooseArtist', this.state.users, (result) => {
          if (this.state.nickName === result) {
            $('body').addClass('drawingMode');
            window.tracking.track('#video', tracker, { camera: true });
            video = document.getElementById('video');
            canvas = document.getElementById('canvas');
            context = canvas.getContext('2d');
          } else {
            $('body').removeClass('drawingMode');
          }
        });

      } else {
        $('body').addClass('gamingRoom');
      }
    });

    (function loop() {
      console.log('tracking draw');
      for (var i = 0, len = drawSegments.length; i < len; i++) {
        trackColor.drawSpline(context, drawSegments[i], 0.5, false);
      }

      drawSegments = [drawSegments[drawSegments.length - 1]];
      segment = 0;

      requestAnimationFrame(loop);
    })();

  }

  _track(event){
    this.props.socket.emit('send:rect', event);
    if (event.data.length === 0 && drawSegments[segment].length > 0) {
      segment++;

      if (!drawSegments[segment]) {
        drawSegments[segment] = [];
      }
    }
    event.data.forEach(function (rect) {
      if (rect.color === 'magenta') {
        drawSegments[segment].push(rect.x + rect.width / 2, rect.y + rect.height / 2);
      } else if (rect.color === 'cyan') {
        context.clearRect(rect.x, rect.y, rect.width, rect.height);
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
    setInterval(updateScroll() ,500);
  }

  _userJoined(data) {
    console.log('user joined');
    var {users, messages} = this.state;
    var {name} = data;
    users.push(name);
    messages.push({
      user: 'BOT',
      text: name + ' Joined'
    });
    this.setState({users, messages});
    if ($('body').hasClass('emptyRoom')) {
      $('body').removeClass('emptyRoom').addClass('gamingRoom');
    }

  }

  _userLeft(data) {
    var {users, messages} = this.state;
    var {name} = data;
    var index = users.indexOf(name);
    users.splice(index, 1);
    messages.push({
      user: 'BOT',
      text: name + ' Left'
    });
    this.setState({users, messages});
    if (data.emptyRoom) {
      $('body').removeClass('gamingRoom').removeClass('drawingMode').addClass('emptyRoom');
      window.tracking.track('#video', tracker, { camera: true });
      video = document.getElementById('video');
      canvas = document.getElementById('canvas');
      context = canvas.getContext('2d');
    }
  }

  _userChangedName(data) {
    var {oldName, newName} = data;
    var {users, messages} = this.state;
    var index = users.indexOf(oldName);
    users.splice(index, 1, newName);
    messages.push({
      user: 'BOT',
      text: 'Change Name : ' + oldName + ' ==> ' + newName
    });
    this.setState({users, messages});
  }

  _userScored(data){
    $('body').removeClass('drawingMode');
    $('.score_announcement-winner').html(data.user);
    $('.score_announcement-draw').html(data.text);
    $('.puns__score_announcement').fadeIn(500, function(){
      $('.puns__score_announcement').delay(1500).fadeOut(500);
    });
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  _newDrawing(data){
    $('.puns_drawingMode .drawing_title').html(data.drawing);
    $('body').addClass('drawingMode');
  }
  _drawRect(event){
    if (event.data.length === 0 && drawSegments[segment].length > 0) {
      segment++;

      if (!drawSegments[segment]) {
        drawSegments[segment] = [];
      }
    }
    event.data.forEach(function (rect) {
      if (rect.color === 'magenta') {
        drawSegments[segment].push(rect.x + rect.width / 2, rect.y + rect.height / 2);
      } else if (rect.color === 'cyan') {
        context.clearRect(rect.x, rect.y, rect.width, rect.height);
      }
    });
  }

  handleMessageSubmit(message) {
    console.log("Handle message sumbit: " + message);
    var {messages} = this.state;
    messages.push(message);
    this.setState({messages});
    this.props.socket.emit('send:message', message);
    setInterval(updateScroll() ,500);
  }

  render() {
    return (
      <div className="puns">
        <div className="puns__waiting_for_players">
          <span>W pokoju nikogo nie ma, poczekaj na innych graczy...</span>
        </div>
        <div className="puns__score_announcement">
          <span>
            Zgadł: <span className="score_announcement-winner"></span><br />
            Rysunek: <div className="score_announcement-draw"></div>
          </span>
        </div>
        <div id="game-box">
          <div className="puns_drawingMode">
            <span>Rysujesz:  <span className="drawing_title"></span></span>
          </div>
          <h2>Kalambury</h2>
          <div className="canvas-frame">
            <div className="demo-container">
              <div className="draw-frame">
                <video id="video" preload autoPlay loop muted></video>
                <canvas id="canvas" width="800" height="600"></canvas>
              </div>
            </div>
          </div>
        </div>
        <div id="chat-box">
          <ChatApp users={this.state.users} messages={this.state.messages} handleMessageSubmit={this.handleMessageSubmit} user={this.state.user}/>

        </div>
        <div id="pencil"></div>
      </div>
    );
  }
}
