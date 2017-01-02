import React, {Component} from 'react';
import NavBar from './navBar.js'
import GameList from './gameList.js'

import './style/portal.css';
// import $ from "jquery";



export default class PortalCenter extends Component {
    render() {
        let nickName = this.props.nickName;
            return (
                <div className="portalCenter">
                    <NavBar />
                    <h2>{this.props.content.pageTitle(nickName)}</h2>
                    <p>{this.props.content.pageSubTitle}</p>
                    <GameList {...this.props.content.gameList}/>
                </div>
            );
        }

    }
