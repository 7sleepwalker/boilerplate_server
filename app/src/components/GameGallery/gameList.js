import React, {Component} from 'react';

import './style/gamelist.css';
import $ from "jquery";



var slideNumber = 0;
var scrollFlag = 0;
function mouseWheelEvent(e) {
  var delta = e.wheelDelta ? e.wheelDelta : -e.detail;
  console.log(delta);
  if (scrollFlag === 0){
    if (delta < 0){
      // scroll down
      if (slideNumber < ($('.gameList-item').length - 1)){
        scrollFlag = 1;
        setTimeout(function(){ scrollFlag = 0; }, 1000);
        slideNumber++;
        console.log(slideNumber);
        $('.gameList__roster').css({
          'transform': 'translateY('+ (-1 * slideNumber * $(window).height()) +'px)'
        });
      }
    }
    else{
      // scroll up
      if (slideNumber > 0){
        scrollFlag = 1;
        setTimeout(function(){ scrollFlag = 0; }, 1000);
        slideNumber--;
        console.log(slideNumber);
        $('.gameList__roster').css({
          'transform': 'translateY('+ (-1 * slideNumber * $(window).height()) +'px)'
        });
      }
    }
  }
}

export default class GameList extends Component {
  componentDidMount(){
    // For Chrome
    window.addEventListener('mousewheel', mouseWheelEvent);
    // For Firefox
    window.addEventListener('DOMMouseScroll', mouseWheelEvent);
  }


  render() {
    var gameList = this.props.games.map((game) => {
      let url =  window.location.origin + '/#/' + game.title;
      let _class = "gameList-item gameList-item__"+ game.id + " gameList-item__" + game.title;
      let divStyle = { backgroundImage: "url("+ game.background_image + ")"};
      return (
        <div className={_class} key={game.id}>
          <div className="gameList-item__background" style={divStyle} ></div>
          <div className="gameList-item__content">
            <h2><a href={url}>{game.title}</a></h2>
            <p className="gameList-item__content-shortDescription">{game.descriptionShort}</p>
            <p className="gameList-item__content-longDescription">{game.descriptionLong}</p>
            <button className='btn' type='button'><a href={url}>Play!</a></button>

          </div>

        </div>
      );
    });

    return (
      <div className="gameList">
        <div className="gameList__roster">
          {gameList}
        </div>
      </div>
    );
  }

}
