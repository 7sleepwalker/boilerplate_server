// src/components/NotFound/index.js
import React, {Component} from 'react';

export default class NotFound extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}

  render() {
    return (
      <div className='NotFound'>
        <div className="container">
          <h1>
             Ups... nie powinno Cie tutaj być!
          </h1>
          <h2>
            Error 404
          </h2>
        </div>
      </div>
    );
  }
}
