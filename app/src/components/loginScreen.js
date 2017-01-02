import React, {Component} from 'react';
import './style/login.css';
import logo from './img/logo.svg';
import $ from "jquery";
import cookie from 'react-cookie';

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {nickName: cookie.load('nickName')};
        // This binding is necessary to make `this` work in the callbac
        this.handleClick = this.handleClick.bind(this);
      }

    handleClick(value){
        cookie.save('nickName', value, { path: '/' });
        location.reload();
    }
    render() {
        return (
            <div className="loginScreen">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>{this.props.content.pageTitle}</h2>
                </div>

                <ul>
                    <li><a href="#">Home</a></li>
                    <li><a href="#/address">Adres</a></li>
                </ul>

                <div className="loginBox">
                    <label htmlFor="nickname">{this.props.content.loginTitle}</label>
                    <input type="text" name="nickname" id="nickname"/><br/>
                    <input type="submit" value={this.props.content.buttonTitle} onClick={() => this.handleClick($('#nickname').val())}/>
                </div>
            </div>
        );
    }
}
