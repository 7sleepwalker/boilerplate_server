import React, {Component} from 'react';
import LoginScreen from './loginScreen.js';
import PortalCenter from './portalCenter.js';

import cookie from 'react-cookie';
import './style/home.css';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickName: cookie.load('nickName')
        };
    }
    render() {
        let nickName = this.state.nickName;
        return (
            <div className="App">
                {nickName ? (
                    <PortalCenter socket={this.props.socket} nickName={nickName} content={this.props.content.portalCenter}></PortalCenter>
                ) : (
                    <LoginScreen socket={this.props.socket} content={this.props.content.loginScreen}></LoginScreen>
                )}
            </div>
        );
    }
}
