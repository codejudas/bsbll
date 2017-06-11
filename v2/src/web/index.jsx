import React from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';

import {Navbar, DEFAULT_TAB} from './components/navbar.jsx';

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
                <div style={styles.content}>Content</div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('content'));