import React from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import {Link} from 'react-router-dom';
import {Helmet} from "react-helmet";

import {COLORS} from '../theme';
import {getPageTitle} from '../util';
import '../style/navbar.scss';


export const TABS = {
    News: 'News', 
    Scoreboard: 'Scoreboard', 
    Standings: 'Standings',
};
export const DEFAULT_TAB = TABS.Scoreboard;


function pathToTab(path) {
    path = path.replace('/app/', '');
    return path.charAt(0).toUpperCase() + path.slice(1);
}


class Tab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.ownRef = props.domRef;
    }

    componentDidMount() {
        // Freeze the width of the component so activating tab cant change size
        let dimensions = ReactDOM.findDOMNode(this).getBoundingClientRect();
        let width = dimensions.width;
        console.log(`Freezing elem width ${width}`);
        // this.setState({
        //     width: width
        // });
    }

    render() {
        let tab_class = ['tab-content']
        if (this.props.active) tab_class.push('tab-active');

        let style = {};
        // if (this.state.width) style.width = this.state.width;
        
        return (
            <Link to={`/${this.props.name.toLowerCase()}`} onClick={() => this.props.action(this.props.name)}>
                <div className="tab">
                    <span className={tab_class.join(' ')} style={style}>
                        {this.props.name}
                    </span>
                </div>
            </Link>
        );
    }
}

export class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.page = pathToTab(location.pathname);
        this.state.seekerOffset = 0; // pixels from the left to offset seeker
    }

    componentDidMount() {
        console.log(`Current page ${this.state.page}`);
        this.navigateToTab(this.state.page);
    }

    navigateToTab(page) {
        console.log(`Navigating to ${page}`);

        let activeTabDimensions = this.getTabDimensions(page);
        this.setState({
            page: pathToTab(page),
            seekerWidth: activeTabDimensions.width,
            seekerOffset: activeTabDimensions.x,
        });
    }

    getTabDimensions(tabName) {
        console.log(`Calculating tab width for ${tabName}`);

        let dimensions = ReactDOM.findDOMNode(this.refs[`Tab-${tabName}`])
                                 .getBoundingClientRect();
        console.log(`Got dimensions: ${JSON.stringify(dimensions)}`);
        return dimensions;
    }

    activateSearch() {
        console.log('Activating Search');
    }

    render() {
        let seekerPosition = {};
        seekerPosition.left = this.state.seekerOffset;
        if (this.state.seekerWidth) seekerPosition.width = this.state.seekerWidth;
        console.log(seekerPosition);

        return (
            <nav id="navbar">
                <Helmet>
                    <title>{getPageTitle(this.state.page)}</title>
                </Helmet>
                <div id="logo">
                    <Link to={`/${DEFAULT_TAB.toLowerCase()}`}>
                        <img id='mlb-logo' src='/assets/img/mlb-white.png'/>
                        <span id='site-title'>BSBLL</span>
                    </Link>
                </div>
                <div id="tab-bar">
                {Object.keys(TABS).map(page =>
                    <Tab key={page} 
                         ref={`Tab-${page}`}
                         domRef={`Tab-${page}`}
                         name={page} 
                         active={page === this.state.page} 
                         action={this.navigateToTab.bind(this)} />
                )}
                </div>
                {/*<ul id="nav-mobile" className="right">
                    {Object.keys(TABS).map(page =>
                        <li key={page}>
                            <Tab name={page} active={page === this.state.page} action={this.navigateToTab.bind(this)}/>
                        </li>
                    )}
                    <li key="search" style={searchStyle} onClick={this.activateSearch.bind(this)}><i className="material-icons left">search</i></li>
                    <li key="padding" style={{paddingRight: NAVBAR_EDGE_PADDING}}></li>
                </ul>*/}
                <div id='navbar-seeker' style={seekerPosition}/>
                <div id='navbar-accent'/>
            </nav>
        );
    }
}