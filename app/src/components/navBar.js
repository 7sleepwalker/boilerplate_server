import React, {Component} from 'react';
// import $ from "jquery";
import './style/navbar.css';

export default class NavBar extends Component {

  render() {
    console.log(this.props);
    var menuList = this.props.content.map((item) => {
      let href = window.location.origin + '/#/' + item.title;
      return( <li><a href={href}>{item.title}</a></li> );
    });
    return (
      <nav>
        <ul>
          {menuList}
        </ul>
      </nav>
    );
  }
}
