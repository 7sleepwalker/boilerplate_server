import React, {Component} from 'react';
import './style/login.css';
import $ from "jquery";
import cookie from 'react-cookie';

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickName: cookie.load('nickName'),
            users: []
        };
        // This binding is necessary to make `this` work in the callbac
        this.handleClick = this.handleClick.bind(this);
      }
      componentDidMount(){
        $('.sideBar').hide();
      }

    handleClick(value){
        // console.log();
        if (this.props.socket.connected){
          this.props.socket.emit('setNickName', {name: value}, (result) => {
              if (result){
                  cookie.save('nickName', value, { path: '/' });
                  location.reload();
              }
              else{
                  alert("Nick zajety");
              }
          });
        }
        else{
          alert('Brak połączenia z serwerem.');
        }

        // alert("Brak");

    }
    render() {
        return (
            <div className="loginScreen">
                <div className="loginBox">
                    <label htmlFor="nickname">{this.props.content.loginTitle}</label>
                    <input type="text" name="nickname" id="nickname"/>
                    <input className="btn" type="submit" value={this.props.content.buttonTitle} onClick={() => this.handleClick($('#nickname').val())}/>
                </div>
            </div>
        );
    }
}
