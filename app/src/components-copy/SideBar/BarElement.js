import React, {Component} from 'react';

import '../style/barElement.css';
// import $ from "jquery";

export default class BarElement extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="sideBar_element">
                <a href="http://localhost:3000/#/kalambury">{this.props.content.title}</a>
            </div>
        );
    }

}
