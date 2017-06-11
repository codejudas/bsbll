import React from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';

import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Navbar, DEFAULT_TAB} from './components/navbar.jsx';

class Scoreboard extends React.Component {
    render() {
        return (
            <div>Scoreboard</div>
        );
    }
}

class Standings extends React.Component {
    render() {
        return (
            <div>Standings</div>
        );
    }
}

class News extends React.Component {
    render() {
        return (
            <div>News</div>
        );
    }
}

class NotFound extends React.Component {
    render() {
        return (
            <div>Not Found</div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        /* DEFAULT TAB */
        this.state.page = DEFAULT_TAB;
    }

    handleTransition() {
        console.log('Transitioning');
        return DEFAULT_TAB;
    }

    render() {
        let styles = {
            base: {
                color: 'red'
            },
            content: {
                marginTop: "50px"
            }
        };
        return (
            <div style={styles.base}>
                <Navbar height="50px" page={this.state.page} transitionFn={this.handleTransition}/>
                <div style={styles.content}>
                    <Switch>
                        <Route exact path='/' component={Scoreboard}/>
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
    document.getElementById('content'));