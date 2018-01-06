import React from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import {Link} from 'react-router-dom';
import {Helmet} from "react-helmet";
import classNames from 'classnames';
import FontAwesome from 'react-fontawesome';

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

class NavElem extends React.Component {
    /**
     * Base class for elements residing in the navbar
     * Props:
     * onClick: fn, callback function when elem is clicked
     * onMouseEnter: fn, callback function when mouse enters elem
     * onMouseLeave: fn, callback function when nouse leaves elem
     * active: bool, whether tab is currently active
     */
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * Returns the JSX content of the NavElem
     */
    getContent() { throw new Error('Method not implemented'); }

    render() {
        return (
            <div className='nav-element'
                 onClick={this.props.onClick} 
                 onMouseEnter={this.props.onMouseEnter}
                 onMouseLeave={this.props.onMouseLeave}>
                 {this.getContent()}
            </div>
        );
    }

}


class Tab extends NavElem {
    /*
     * Props:
     * text: str, tab name
     */
    constructor(props) {
        super(props);
    }

    /* Override */
    getContent() {
        return (
            <span className='tab-content'>
                {this.props.text}
            </span>
        );
    }
}

class Button extends NavElem {
    /*
     * Props:
     * icon: JSX or str url to an image
     */
    constructor(props) {
        super(props);
    }

    getContent() {
        return (
            <FontAwesome className='fa fa-search button-search'
                         name='search'
                         size='2x'/>
        );
    }
}

export class Navbar extends React.Component {
    /**
     * Props
     * searchActive: bool, whether search is active
     * searchCallback: fn, called when search button is clicked
     */
    constructor(props) {
        super(props);
        this.seekables = {};        // Things that can be seeked to by the seeker
        this.state = {
            page: pathToTab(location.pathname), // Set by constructor
            seekerOffset: 0,                    // Pixels from the left to offset seeker
            seekerHidden: true,                 // Start seeker hidden
            seekerPulsed: false,                // Only pulsed on click
        };
    }

    componentDidMount() {
        console.log(`Current page ${this.state.page}`);
        // Necessary to let everything load before getting value?
        setTimeout(() => {
            this.moveSeeker(this.state.page);
            // Make the seeker appear
            setTimeout(() => {
                this.setState({
                    seekerHidden: false,
                });
            }, 700);
        }, 1000);
    }

    navigateToTab(tab) {
        console.log(`Navigating to tab ${tab}`);
        this.setState({
            page: pathToTab(tab),
        })
        this.pulseSeeker();
        this.props.searchCallback(false);
    }

    handleSearchButton() {
        this.props.searchCallback();
        this.pulseSeeker();
    }

    pulseSeeker() {
        console.log('Pulsing seeker');
        this.setState({
            seekerPulsed: true,
        });

        setTimeout(() => this.setState({
            seekerPulsed: false,
        }), 300);
    }

    moveSeeker(elem) {
        console.log(`Moving seeker to ${elem}`);

        let activeElem = this.getElemDimensions(elem);
        this.setState({
            seekerWidth: activeElem.width,
            seekerOffset: activeElem.x,
        });
    }

    seekerIdle() {
        console.log(`Returning seeker to idle position`);
        let selectedElem = this.state.page;
        if (this.props.searchActive) {
            selectedElem = 'search';
        }

        this.moveSeeker(selectedElem);
    }

    getElemDimensions(elem) {
        console.log(`Calculating element width for ${elem}`);
        let dimensions = ReactDOM.findDOMNode(this.seekables[elem.toLowerCase()])
                                 .getBoundingClientRect();
        console.log(`Got dimensions: ${JSON.stringify(dimensions)}`);
        return dimensions;
    }

    render() {
        let seekerClass = classNames({
            'seeker-start': this.state.seekerHidden,
            'seeker-pulse': this.state.seekerPulsed,
        });

        let seekerPosition = {
            left: this.state.seekerOffset,
            width: this.state.seekerWidth ? this.state.seekerWidth : 0,
        };

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
                    <Link key={page} to={`/${page.toLowerCase()}`}>
                        <Tab ref={(tab) => this.seekables[page.toLowerCase()] = tab}
                             text={page} 
                             active={page === this.state.page} 
                             onClick={() => {this.navigateToTab(page)}}
                             onMouseEnter={() => this.moveSeeker(page)}
                             onMouseLeave={() => this.seekerIdle()} />
                    </Link>
                )}
                </div>
                <div id="button-bar">
                    <Button class="button-search" 
                            key='search'
                            ref={(ref) => this.seekables.search = ref}
                            icon='material-icons left'
                            name='search'
                            active={this.props.searchActive}
                            onClick={this.handleSearchButton.bind(this)}
                            onMouseEnter={() => this.moveSeeker('search')}
                            onMouseLeave={() => this.seekerIdle()} />
                </div>
                <div id='navbar-seeker' className={seekerClass} style={seekerPosition}/>
                <div id='navbar-accent'/>
            </nav>
        );
    }
}