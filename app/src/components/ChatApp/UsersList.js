import React, {Component} from 'react';

import './style/UsersList.css';


export default class UsersList extends Component {

    render() {
          return (
              <div className='users'>
                  <h5> Online Users </h5>
                  <div>
                      {
                          this.props.users.map((user, i) => {
                              return (
                                  <span key={i}>
                                      {user}
                                  </span>
                              );
                          })
                      }
                  </div>
              </div>
          );
      }

}
