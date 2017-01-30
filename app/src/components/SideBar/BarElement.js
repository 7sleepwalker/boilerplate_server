import React, {Component} from 'react';

import '../style/barElement.css';
// import $ from "jquery";

export default class BarElement extends Component {
    render() {
        let url = window.location.origin + '/#/' + this.props.content.title;
        return (
            <a href={url} className="sideBar_element">
                <div className="sideBar_element-avatar" style={{backgroundImage: 'url(' + this.props.content.avatar + ')'}}></div>
                <span href={url}>{this.props.content.title}</span>
            </a>
        );
    }

}
