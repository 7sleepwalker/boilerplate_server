import React, {Component} from 'react';


export default class Message extends Component {

    render() {
      var user;
      if (this.props.user === "BOT"){
        user = <strong className="application_message"> {this.props.user} </strong>;
      }
      else{
        user = <strong> {this.props.user} </strong>;
      }
      return (
          <div className="message">
              {user}
              <span>{this.props.text}</span>
          </div>
      );
  }

}
