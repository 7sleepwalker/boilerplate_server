import React, {Component} from 'react';


export default class UsersList extends Component {

    render() {
          return (
              <div className='users'>
                  <h3> Online Users </h3>
                  <ul>
                      {
                          this.props.users.map((user, i) => {
                              return (
                                  <li key={i}>
                                      {user}
                                  </li>
                              );
                          })
                      }
                  </ul>
              </div>
          );
      }

}
