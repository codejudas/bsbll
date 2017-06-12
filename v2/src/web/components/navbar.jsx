import React from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import {Link} from 'react-router-dom';


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
    render() {
        let style = {
            cursor: 'pointer',
            height: '90%',
            display: 'inline-block',
            backgroundColor: 'grey',
            ':hover': {
                backgroundColor: 'blue'
            }
        };
        return (
            <Link to={`/${this.props.name.toLowerCase()}`}>
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
        console.log(`Current page ${this.state.page}`);
    }

    render() {
        // console.log(`Current page: ${this.props.location.pathname}`);
        let barStyle = {
            position: "fixed", 
            width: "100%", 
            top: 0, 
            height: this.props.height, 
            backgroundColor: "cyan"
        };
        let headerStyle = {
            transition: '0.5s background-color',
            display: 'inline-block',
            backgroundColor: 'blue',
            color: 'white',
            height: '100%',
            ':hover': {
                backgroundColor: 'red',
                transition: '0.5s background-color'
            }
        };
        let tabs = Object.keys(TABS).map(page => <Tab key={page} name={page}/>);
        return (
            <div id="navbar" style={barStyle}>
                <div style={headerStyle}>Navbar {this.state.page}</div>
                {tabs}
            </div>
        );
    }
}
Navbar = Radium(Navbar);