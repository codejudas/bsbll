import React from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import {Helmet} from "react-helmet";

import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';

import {Navbar, DEFAULT_TAB} from './components/navbar.jsx';
import {Scoreboard} from './components/scoreboard.jsx';
import {Standings} from './components/standings.jsx';
import {News} from './components/news.jsx';
import {NotFound} from './components/not_found.jsx';
import {COLORS} from './theme';
import {getPageTitle} from './util';


const GLOBAL_STYLE = {
    backgroundColor: COLORS.BACKGROUND,
    margin: 0
};


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        Object.assign(document.body.style, GLOBAL_STYLE);
        console.log('Mounted app!');
    }
     
    componentWillUnmount() {
        this.unlisten();
    }

    render() {
        let NAV_SIZE = 80; //px

        let contentStyle = {
            marginTop: `${NAV_SIZE + 20}px`
        };

        return (
            <div style={GLOBAL_STYLE}>
                <Helmet>
                    <title>{getPageTitle()}</title>
                </Helmet>
                <Navbar height={NAV_SIZE} />
                <div style={contentStyle}>
                    <Switch>
                        <Redirect exact from='/' to='/scoreboard'/>
                        <Route path='/scoreboard' component={Scoreboard}/>
                        <Route path='/standings' component={Standings}/>
                        <Route path='/news' component={News}/>
                        <Route path='*' component={NotFound}/>
                    </Switch>
                </div>
            </div>
        );
    }
}


ReactDOM.render(
    <BrowserRouter basename="/app">
        <App />
    </BrowserRouter>, 
    document.getElementById('content')
);