import React, {Component} from 'react';
import GameList from './gameList.js';
import './style/gamegallery.css';
import $ from "jquery";

export default class GameGallery extends Component {
    componentDidMount(){
      $('.sideBar').hide();
    }
    render() {
        return (
            <div className="gameGallery">
                <a href='#' className="gameGallery__back"><span className="glyphicon glyphicon-chevron-left"></span><div className="gameGallery__back-title">back</div></a>
                <GameList {...this.props.content.gameList}/>
            </div>
        );
    }

}
