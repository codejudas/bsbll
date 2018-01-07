import React from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import {Helmet} from "react-helmet";

import {withRouter} from 'react-router';
import {
    BrowserRouter, 
    Route, 
    Switch, 
    Redirect,
} from 'react-router-dom';

import {Navbar, DEFAULT_TAB} from './components/navbar.jsx';
import {Scoreboard} from './components/scoreboard.jsx';
import {Standings} from './components/standings.jsx';
import {News} from './components/news.jsx';
import {SearchOverlay} from './components/search.jsx';
import {NotFound} from './components/not_found.jsx';
import {COLORS} from './theme';
import {getPageTitle} from './util';

import './style/background.scss';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchActive: false,
        };
    }

    componentDidMount() {
        console.log('Mounted app!');
        this.props.history.listen(this.handleRouteChange.bind(this));
    }

    toggleSearch(value) {
        console.log(`Toggling search: ${value}`);

        let new_value = (value === undefined) ? !this.state.searchActive : value;
        this.setState({
            searchActive: new_value,
        })
    }

    handleRouteChange(location) {
        console.log(`Route changed to ${location.pathname}`);
        // Turn off search anytime page changes
        this.toggleSearch(false);
    }

    render() {
        return (
            <div id="app">
                <Helmet>
                    <title>{getPageTitle()}</title>
                    <link href="https://fonts.googleapis.com/css?family=Lato:300,400|Roboto:300,400,500" rel="stylesheet" />
                    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous" />
                </Helmet>
                <Navbar searchActive={this.state.searchActive}
                        searchCallback={this.toggleSearch.bind(this)} />
                <div className="container">
                    <SearchOverlay active={this.state.searchActive} 
                                   onDismissed={this.toggleSearch.bind(this)} />
                    <div className="content">
                        <Switch>
                            <Redirect exact from='/' to='/scoreboard'/>
                            <Route path='/scoreboard' component={Scoreboard}/>
                            <Route path='/standings' component={Standings}/>
                            <Route path='/news' component={News}/>
                            <Route path='*' component={NotFound}/>
                        </Switch>
                    </div>
                </div>
            </div>
        );
    }
}
App = withRouter(App);


ReactDOM.render(
    <BrowserRouter basename="/app" history={history}>
        <App />
    </BrowserRouter>, 
    document.getElementById('content')
);