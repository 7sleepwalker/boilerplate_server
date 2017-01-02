import React, {Component} from 'react';

import './style/gamelist.css';
// import $ from "jquery";



export default class GameList extends Component {
    render() {
        let gameList = this.props.games.map((game) => {
            return <li key={game.id}><a href="#/kalambury">{game.title}</a></li>;
        });
        console.log(gameList);
            return (
                <div className="gameList">
                    <h2>This is game list</h2>
                    <ul>
                        {gameList}
                    </ul>
                </div>
            );
        }

    }
