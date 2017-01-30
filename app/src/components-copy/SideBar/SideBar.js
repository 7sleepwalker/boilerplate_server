import React, {Component} from 'react';
import BarElement from './BarElement.js'

import '../style/sideBar.css';
// import $ from "jquery";

export default class SIdeBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var BarElements = this.props.content.gameList.games.map(function(game) {
            return (<BarElement content={game}/>)
        });

        return (
            <div className="sideBar">
                <div className="sideBar_collapsed">
                    <div className="sideBar_collapsed-title">
                        - Menu -
                    </div>
                </div>
                <div className="sideBar_title">Games</div>
                {BarElements}
            </div>
        );
    }

}
