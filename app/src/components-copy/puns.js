import React, {Component} from 'react';

import "tracking";
import './style/puns.css';
import ChatApp from './ChatApp/ChatApp';
// require("../scripts/puns.js");

import $ from "jquery";
import cookie from 'react-cookie';

var trackColor = require("../scripts/splines.min.js");

export default class Puns extends Component {

    constructor(props) {
        super(props);

        this.props = {
          drawSegments: [[]],
          segment: 0
        }


        this.state = {
            nickName: cookie.load('nickName'),
            users: [],
            messages: [],
            text: '',
            drawing: ''
        }
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
    componentWillMount() {
        // this.props.socket.emit('setNickName', {name: this.state.nickName}, (result) => {
        //     if (result){
        //         console.log('setNickName');
        //     }
        // });
    }
    componentDidMount() {
        //require("../scripts/splines.min.js");
        trackColor(this.props.socket);
        console.log('draw');
        console.log(trackColor.draw());
        // console.log("NA: "+ trackColor.draw());
        // require("../scripts/splines.min.js")(this.props.socket);
        // console.log(trackingColor.importTMP);


        this.props.socket.on('init', this._initialize);
        this.props.socket.on('send:message', this._messageRecieve);
        this.props.socket.on('user:join', this._userJoined);
        this.props.socket.on('user:left', this._userLeft);
        this.props.socket.on('change:name', this._userChangedName);
        this.props.socket.on('new:drawing', this._newDrawing)
        this.props.socket.on('user:scored', this._userScored);
        this.props.socket.on('get:rect', this._drawRect);
        this.props.socket.on('logIn_PUNS', () => {
            console.log("tworze strone");
            if (this.state.users.length === 1) {
                console.log("empty room");
                $('body').addClass('emptyRoom');
            } else if (this.state.users.length === 2) {
                $('body').addClass('gamingRoom');
                this.props.socket.emit('chooseArtist', this.state.users, (result) => {
                    if (this.state.nickName === result) {
                        $('body').addClass('drawingMode');
                    } else {
                        $('body').removeClass('drawingMode');
                    }
                });

            } else {
                console.log("gaming");
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
        console.log('user joined');
        var {users, messages} = this.state;
        var {name} = data;
        users.push(name);
        messages.push({
            user: 'APPLICATION BOT',
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
            user: 'APPLICATION BOT',
            text: name + ' Left'
        });
        this.setState({users, messages});
        if (data.emptyRoom) {
            $('body').removeClass('gamingRoom').removeClass('drawingMode').addClass('emptyRoom');
        }
    }

    _userChangedName(data) {
        var {oldName, newName} = data;
        var {users, messages} = this.state;
        var index = users.indexOf(oldName);
        users.splice(index, 1, newName);
        messages.push({
            user: 'APPLICATION BOT',
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

    }
    _newDrawing(data){
        $('.puns_drawingMode .drawing_title').html(data.drawing);
        $('body').addClass('drawingMode');
    }
    _drawRect(data){


        this.props.drawSegments = [[]];
        this.props.segment = 0;
        if (data.length === 0){
          // console.log(data);
        }
        data.forEach(function (rect) {
            if (rect.color === 'magenta'){
              console.log("draw: ");
              console.log(rect);
              this.props.drawSegments[this.props.segment].push(rect.x + rect.width / 2, rect.y + rect.height / 2);
            } else if (rect.color === 'cyan'){
              // console.log("erase: " + trackColor.erase(rect));
              // trackColor.erase(rect);
            }
        });
    }

    handleMessageSubmit(message) {
        console.log("Handle message sumbit: " + message);
        var {messages} = this.state;
        messages.push(message);
        this.setState({messages});
        this.props.socket.emit('send:message', message);
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
                <div className="puns_drawingMode">
                    <span>Rysujesz!  <span className="drawing_title"></span></span>
                </div>
                <h2>This is game puns</h2>
                <div className="demo-frame">
                    <div className="demo-container">
                        <div className="draw-frame">
                            <video id="video" preload autoPlay loop muted></video>
                            <canvas id="canvas" width="800" height="600"></canvas>
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
