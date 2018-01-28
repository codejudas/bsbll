import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import FontAwesome from 'react-fontawesome';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import * as fuzzy from 'fuzzy';

import '../style/search.scss';

const DUMMY_SEARCH_RESULTS = [
    'San Francisco Giants',
    'Buster Posey',
    'Barry Bonds',
    'Tim Lincecum',
    'Hunter Pence',
    'Ryan Vogelsong',
    'Brandon Crawford',
    'Evan Longoria',
    'Andrew McCutchen',
    'Johnny Cueto',
];

export class SearchBox extends React.Component {
    static propTypes = {
        // Whether search is currently active
        active: PropTypes.bool.isRequired,
        // Placeholder to display in search box
        placeholder: PropTypes.string,
    };
    
    constructor(props) {
        super(props);
        this.state = {
            focused: false,
            searchResults: [],
        };
    }

    /**
     * Grab focus to input when search is activated
     */
    componentWillReceiveProps(nextProps) {
        // When search is activated, grab focus
        if (this.props.active !== nextProps.active) {
            this.setState({
                focused: nextProps.active,
            });
        }
    }

    /**
     * Grab focus to input when search is active
     */
    componentDidUpdate(prevProps) {
        if (prevProps.active != this.props.active) {
            if (this.props.active) this.searchInput.focus();
            else this.searchInput.blur();
        }
    }

    /**
     * Load new search results from searchQuery
     */
    loadSearchResuts(searchQuery) {
        console.log(`Getting results for ${searchQuery}`);
        let matches = [];
        /* Only load results if there is something in the input */
        if (searchQuery !== '') {
            let options = {pre: '<b>', post: '</b>'};
            matches = fuzzy.filter(searchQuery, DUMMY_SEARCH_RESULTS, options);
        }

        console.log(`Got matches ${JSON.stringify(matches)}`);
        this.setState({
            searchResults: matches.map(elem => {
                let url = '/' + elem.original.toLowerCase().replace(' ', '_');
                return {
                    url: url,
                    text: elem.string
                }
            })
        });
    }

    /**
     * Display search results stored in state
     */
    displaySearchResults() {
        let results = [];
        this.state.searchResults.forEach((elem, idx) => {
            results.push(
                <SearchResult key={idx} {...elem}>{elem.text}</SearchResult>
            );
            if (idx !== (this.state.searchResults.length - 1)) {
                results.push(<SearchResultDivider key={`div-${idx}`} />);
            }
        });
        return results;
    }

    /**
     * Event handler for search input box
     */
    onInputChanged() {
        let inputText = this.searchInput.value;
        console.log(`Search input: ${inputText}`);
        // TODO: Dont do this on every change event
        this.loadSearchResuts(inputText);
    }

    /**
     * Animate input being focused or blurred
     */
    onInputFocus(event) {
        if (event === 'blurred') this.setState({ focused: false });
        else if (event === 'focused') this.setState({ focused: true });
    }

    render() {
        console.log('Rendering results: ' + JSON.stringify(this.state.searchResults));
        let inputClass = classNames('search-input-group', {
            'focused': this.state.focused,
            'hidden': !this.props.active,
        });
        return (
            <span className='search-modal'>
                <div className={inputClass}>
                    <FontAwesome className='fa fa-search'
                                name='search'
                                size='2x'/>
                    <input type='text' 
                        ref={(input) => this.searchInput = input}
                        className='search-input'
                        placeholder={this.props.placeholder}
                        onChange={this.onInputChanged.bind(this)}
                        onBlur={() => this.onInputFocus('blurred')}
                        onFocus={() => this.onInputFocus('focused')} />
                </div>
                <div className='search-results-group'>
                    {this.displaySearchResults()}
                </div>
            </span>
        );
    }
}


class SearchResult extends React.Component {
    static propTypes = {
        // Url to redirect to if result is clicked
        url: PropTypes.string.isRequired,
    };
    
    render() {
        return (
            <Link to={this.props.url}>
                <div className='search-result'
                     dangerouslySetInnerHTML={{__html: this.props.children}}></div>
            </Link>
        );

    }
}

class SearchResultDivider extends React.Component {
    static propTypes = {};

    render () {
        return (
            <div className='search-divider'>
                <div className='search-divider-bar' />
            </div>
        );
    }
}



export class SearchOverlay extends React.Component {
    static propTypes = {
        // True if overlay should display
        active: PropTypes.bool.isRequired,
        // Callback when user dismisses search overlay
        onDismissed: PropTypes.func,
    };

    componentWillMount() {
        document.onkeyup = this.handleKeyPress.bind(this);
    }

    componentWillUnmount() {
        document.onkeyup = undefined;
    }

    /**
     * Bind esc key to dismiss search
     */
    handleKeyPress(event) {
        console.log(event);
        if(event.key == 'Escape'){
            event.preventDefault();
            console.log('Dismissing search');
            this.props.onDismissed(false);
        }
    }

    render() {
        let overlayClass = classNames({
            "hidden": !this.props.active
        });
        return (
            <div id="search-container" className={overlayClass} onKeyPress={this.handleKeyPress.bind(this)}>
                <div id="search-background" 
                     className={overlayClass}
                     onClick={() => this.props.onDismissed(false)} />

                <SearchBox active={this.props.active}
                           placeholder='Search...'/>
            </div>
        );
    }
}