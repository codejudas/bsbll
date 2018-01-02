import React from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import {Link} from 'react-router-dom';
import {Helmet} from "react-helmet";
import classNames from 'classnames';

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
    }

    render() {
        let tab_class = classNames('tab-content');
        
        return (
            <Link to={`/${this.props.name.toLowerCase()}`} onClick={() => this.props.action(this.props.name)}>
                <div className="tab">
                    <span className={tab_class}>
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
        this.state = {
            page: pathToTab(location.pathname), // Set by constructor
            seekerOffset: 0,                    // Pixels from the left to offset seeker
            seekerHidden: true,                 // Start seeker hidden
            searchActive: false,                // Search being hidden
        };
    }

    componentDidMount() {
        console.log(`Current page ${this.state.page}`);
        // Necessary to let everything load before getting value?
        setTimeout(() => {
            this.navigateToTab(this.state.page);
            // Make the seeker appear
            setTimeout(() => {
                this.setState({
                    seekerHidden: false,
                });
            }, 700);
        }, 1000);
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
        let seekerClass = classNames({'seeker-start': this.state.seekerHidden});
        let seekerPosition = {};
        seekerPosition.left = this.state.seekerOffset;
        if (this.state.seekerWidth) seekerPosition.width = this.state.seekerWidth;

        console.log('Seeker pos: ' + JSON.stringify(seekerPosition));

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
                         name={page} 
                         active={page === this.state.page} 
                         action={this.navigateToTab.bind(this)} />
                )}
                    <Tab key="search" 
                         icon='material-icons left'
                         name='search'
                         active={this.state.searchActive}
                         action={this.activateSearch.bind(this)} />
                </div>
                {/*<ul id="nav-mobile" className="right">
                    {Object.keys(TABS).map(page =>
                        <li key={page}>
                            <Tab name={page} active={page === this.state.page} action={this.navigateToTab.bind(this)}/>
                        </li>
                    )}
                    <li key="padding" style={{paddingRight: NAVBAR_EDGE_PADDING}}></li>
                </ul>*/}
                <div id='navbar-seeker' className={seekerClass} style={seekerPosition}/>
                <div id='navbar-accent'/>
            </nav>
        );
    }
}