import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home';
import Puns from './components/puns';

import './index.css';
import { Router, Route, hashHistory } from 'react-router'


var content = {
    home: {
        loginScreen: {
            pageTitle: "Welcome to Heiko-pen",
            loginTitle: "Aby kontynuować wypisz nickname:",
            buttonTitle: "Wejdź"
        },
        portalCenter: {
            pageTitle: (nickName) => { return ("Hello " + nickName + "on Heiko-pen GamePortal!") },
            pageSubTitle: "Want to play a game?",
            gameList:{
                games:
                [{
                    id: "0",
                    title: "Kalambury"
                }]
            }
        }
    }
}




ReactDOM.render(
    <Router history={hashHistory}>
        <Route path='/' component={() => (<Home content={content.home} />)}  />
        <Route path='/address' component={() => (<Home foo="bar" />)}   />
        <Route path='/kalambury' component={() => (<Puns foo="bar" />)}   />
    </Router>,
  document.getElementById('root')
);

// ReactDOM.render(
//   <ChatApp />,
//   document.getElementById('chat-box')
// );
