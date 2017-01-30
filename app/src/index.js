import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home';
import Puns from './components/puns';
import NotFound from './components/NotFound';
import SideBar from './components/SideBar/SideBar.js';
import GameGallery from './components/GameGallery/GameGallery.js';

import './index.css';
import {Router, Route, hashHistory} from 'react-router'

import io from 'socket.io-client';
let socket = io.connect();

import cookie from 'react-cookie';


//  images
import HomeCover from './components/img/cover.png';
import AvatarPuns from './components/img/avatar_puns.png';
import AvatarRacinger from './components/img/avatar_racinger.png';


var content = {
    home: {
        loginScreen: {
            pageTitle: "Welcome to Heiko-pen",
            loginTitle: "Aby kontynuować wypisz nickname:",
            buttonTitle: "Wejdź"
        },
        portalCenter: {
            url : '#/',
            cover: HomeCover,
            pageTitle: (nickName) => {
                return ("Witaj " + nickName + " na portalu Heiko-pen!")
            },
            pageSubTitle: "Want to play a game?",
            subPages: [{title: 'About'}, {title: 'Games'}],
            gameList: {
                games: [
                    {
                        id: "0",
                        avatar: AvatarPuns,
                        title: "Kalambury",
                        descriptionShort: "Bla bla bla",
                        descriptionLong: "Long bla bla bla",
                        tags: ['rysunek', 'multi'],
                        background_image: 'http://harzowski.h2g.pl/gallery/puns.jpg'
                    },
                    {
                        id: "1",
                        avatar: AvatarRacinger,
                        title: "Racinger",
                        descriptionShort: "Bla bla bla",
                        descriptionLong: "Wkrótce dostępna!",
                        tags: ['wyścigi', 'multi', 'split screen'],
                        background_image: 'http://harzowski.h2g.pl/gallery/racinger.jpg'
                    }
                ]
            }
        }
    }
}

var nickName = cookie.load('nickName');
socket.emit('setNickName', {
    name: nickName
}, (result) => {
    if (result) {
        console.log('true');
    } else {
        console.log('false');
    }
});

let onEnterPuns = () => {
    var nickName = cookie.load('nickName');
    socket.emit('joinPuns', nickName);
}


ReactDOM.render(
    <div>
    <SideBar content={content.home.portalCenter}/>
    <Router history={hashHistory}>
        <Route path='/' component={() => (<Home socket={socket} content={content.home}/>)}/>
        <Route path='/Games' component={() => (<GameGallery socket={socket} content={content.home.portalCenter} />)}/>
        <Route path='/Kalambury' component={() => (<Puns socket={socket}/>)} onEnter={onEnterPuns}/>
        <Route path="*" component={NotFound} />
    </Router>
</div>, document.getElementById('root'));

// ReactDOM.render(
//   <ChatApp />,
//   document.getElementById('chat-box')
// );
