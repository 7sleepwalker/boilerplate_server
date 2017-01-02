import React, {Component} from 'react';

 import "tracking";
import './style/puns.css';
import ChatApp from './ChatApp/ChatApp';
// require("../scripts/puns.js");




export default class Puns extends Component {
    componentDidMount(){
        require("../scripts/stats.min.js");
        require("../scripts/splines.min.js");
    }
    render() {
        return (
            <div className="puns">
                <div className="puns__waiting_for_players"><span>W pokoju nikogo nie ma, poczekaj na innych graczy...</span></div>
                <h2>This is game puns</h2>
                <div className="demo-frame">
                    <div className="demo-container">
                        <div className="draw-frame">
                            <video id="video" width="800" height="600" preload autoPlay loop muted></video>
                            <canvas id="canvas" width="800" height="600"></canvas>
                        </div>
                    </div>
                </div>
                <div id="chat-box">
                    <ChatApp />

                </div>
                <div id="pencil"></div>
            </div>
        );
    }
}
