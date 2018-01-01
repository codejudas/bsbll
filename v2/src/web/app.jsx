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
                    {/*<script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>*/}
                    {/*<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css"/>*/}
                    {/*<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>*/}
                    {/*<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js"></script>*/}
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