import React from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';

const PAGES = {
    News: 'News', 
    Scoreboard: 'Scoreboard', 
    Standings: 'Standings',
};

class Tab extends React.Component {
    render() {
        let style = {
            height: '100%',
            display: 'inline-block',
            backgroundColor: 'grey',
            ':hover': {
                backgroundColor: 'blue'
            }
        };
        return <div style={style} className="tab">{this.props.name}</div>;
    }

}
Tab = Radium(Tab);

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.page = props.page;
    }

    render() {
        let style = {
            bar: {
                position: "fixed", 
                width: "100%", 
                top: 0, 
                height: this.props.height, 
                backgroundColor: "cyan"
            },
            header: {
                display: 'inline-block',
                backgroundColor: 'blue',
                color: 'white'
            }
        };
        let tabs = Object.keys(PAGES).map(page => <Tab key={page} name={page}/>);
        return (
            <div id="navbar" style={style.bar}>
                <div style={style.header}>Navbar {this.state.page}</div>
                {tabs}
            </div>
        );
    }
}
Navbar = Radium(Navbar);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        /* DEFAULT PAGE */
        this.state.page = PAGES.Scoreboard;
    }

    handleTransition() {
        console.log('Transitioning');
        return DEFAULT_PAGE;
    }

    render() {
        let content_style = {marginTop: "50px"};
        return (
            <div>
                <Navbar height="50px" page={this.state.page} transitionFn={this.handleTransition}/>
                <div style={content_style}>Content</div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('content'));