import React, {Component} from 'react';
import NavBar from './navBar.js';
import $ from "jquery";

import './style/portal.css';

export default class PortalCenter extends Component {
  componentDidMount(){
    $('.sideBar').show();
  }
    render() {
        let nickName = this.props.nickName;
        return (
            <div className="portalCenter">
                <NavBar content={this.props.content.subPages} /> {/* <SideBard /> */}
                {/* <div className="portalCenter__background" style={{backgroundImage: 'url(' + this.props.content.cover + ')'}}> </div> */}
                <img className="portalCenter__background" alt='background' src={this.props.content.cover}/>
                <div className="portalCenter__content">
                  <h2>{this.props.content.pageTitle(nickName)}</h2>
                  <p>{this.props.content.pageSubTitle}</p>
                </div>

            </div>
        );
    }

}
