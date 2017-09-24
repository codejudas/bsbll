import React from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import {Link} from 'react-router-dom';
import {Helmet} from "react-helmet";

import {COLORS} from '../theme';
import {getPageTitle} from '../util';


export const TABS = {
    News: 'News', 
    Scoreboard: 'Scoreboard', 
    Standings: 'Standings',
};
export const DEFAULT_TAB = TABS.Scoreboard;

const LOGO_PADDING = 10; //px


function pathToTab(path) {
    path = path.replace('/app/', '');
    return path.charAt(0).toUpperCase() + path.slice(1);
}


class Tab extends React.Component {
    render() {
        let style = {
            cursor: 'pointer',
            height: '90%',
            display: 'inline-block',
            paddingLeft: '15px',
            paddingRight: '15px',
            // ':hover': {
            //     backgroundColor: 'blue'
            // }
        };

        if (this.props.active) style.fontWeight = 700;
        
        return (
            <Link to={`/${this.props.name.toLowerCase()}`} onClick={() => this.props.action(this.props.name)}>
                <div style={style} className="tab">
                    {this.props.name}
                </div>
            </Link>
        );
    }
}
Tab = Radium(Tab);

export class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.page = pathToTab(location.pathname);
    }

    componentDidMount() {
        console.log(`Current page ${this.state.page}`);
    }

    navigateToTab(page) {
        console.log(`Update page ${page}`);
        this.setState({page: pathToTab(page)});
    }

    render() {
        // console.log(`Current page: ${this.props.location.pathname}`);
        let barStyle = {
            position: "fixed", 
            width: "100%", 
            top: 0, 
            height: `${this.props.height}px`, 
            backgroundColor: COLORS.BACKGROUND,
            borderBottom: `solid 7px ${COLORS.ACCENT_MAIN}`
        };
        let headerStyle = {
            transition: '0.5s background-color',
            display: 'inline-block',
            height: '100%',
            padding: '0px 15px',
            // ':hover': {
            //     backgroundColor: 'red',
            //     transition: '0.5s background-color'
            // }
        };
        let imgStyle = {
            height: `${this.props.height - (LOGO_PADDING*2)}px`,
            marginTop: `${LOGO_PADDING}px`
        }

        return (
            <div id="navbar" style={barStyle}>
                <Helmet>
                    <title>{getPageTitle(this.state.page)}</title>
                </Helmet>

                <div style={headerStyle}>
                    <img style={imgStyle} id='mlb-logo' src='/assets/img/mlb.png' />
                </div>
                {Object.keys(TABS).map(page =>
                    <Tab key={page} name={page} active={page === this.state.page} action={this.navigateToTab.bind(this)}/>
                )}
            </div>
        );
    }
}
Navbar = Radium(Navbar);