import React, {Component} from 'react';


export default class ChangeNameForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newName: ''
        }
        this.onKey = this.onKey.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
  onKey(e) {
      this.setState({ newName : e.target.value });
  }

  handleSubmit(e) {

      e.preventDefault();
      var newName = this.state.newName;
      this.props.onChangeName(newName);
      console.log(newName);
      this.setState({ newName: '' });
  }

  render() {
      return(
          <div className='change_name_form'>
              <h3> Change Name </h3>
              <form onSubmit={this.handleSubmit}>
                  <input
                      onChange={this.onKey}
                      value={this.state.newName}
                  />
              </form>
          </div>
      );
  }

}
