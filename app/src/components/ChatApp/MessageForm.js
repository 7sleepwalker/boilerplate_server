import React, {Component} from 'react';

import './style/MessageForm.css';

export default class MessageForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
  handleSubmit(e) {
      e.preventDefault();
      var message = {
          user : this.props.user,
          text : this.state.text
      }
      this.props.onMessageSubmit(message);
      this.setState({ text: '' });
  }

  changeHandler(e) {
    //   console.log(this.state);
      this.setState({ text : e.target.value });
  }

  render() {
      return(
          <div className='message_form'>
              <h5>Write New Message</h5>
              <form onSubmit={this.handleSubmit}>
                  <input
                      onChange={this.changeHandler}
                      value={this.state.text}
                  />
              </form>
          </div>
      );
  }
}
