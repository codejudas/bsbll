import React from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import {Helmet} from "react-helmet";

import {BrowserRouter, HashRouter, Route, Switch, Redirect} from 'react-router-dom';

import {Navbar, DEFAULT_TAB} from './components/navbar.jsx';
import {Scoreboard} from './components/scoreboard.jsx';
import {Standings} from './components/standings.jsx';
import {News} from './components/news.jsx';
import {NotFound} from './components/not_found.jsx';
import {COLORS} from './theme';
import {getPageTitle} from './util';

import './style/background.scss';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // Object.assign(document.body.style, GLOBAL_STYLE);
        console.log('Mounted app!');
    }
     
    componentWillUnmount() {
        this.unlisten();
    }

    render() {
        return (
            <div id="app">
                <Helmet>
                    <title>{getPageTitle()}</title>
                    <link href="https://fonts.googleapis.com/css?family=Lato:300,400|Roboto:300,400,500" rel="stylesheet" />
                </Helmet>
                <Navbar/>
                <div className="container">
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