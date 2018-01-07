import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import FontAwesome from 'react-fontawesome';
import {Link} from 'react-router-dom';

import '../style/search.scss';

export class SearchBox extends React.Component {
    /**
     * props:
     * active - bool, whether search is visible
     */
    constructor(props) {
        super(props);
        this.state = {
            focused: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        // When search is activated, grab focus
        if (this.props.active !== nextProps.active) {
            this.setState({
                focused: nextProps.active,
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.active != this.props.active) {
            if (this.props.active) this.searchInput.focus();
            else this.searchInput.blur();
        }
    }

    onInputChanged(event) {
        console.log('Search input changed!');
    }

    onInputFocus(event) {
        if (event === 'blurred') this.setState({ focused: false });
        else if (event === 'focused') this.setState({ focused: true });
    }

    render() {
        console.log(`this.state.focused: ${this.state.focused}`);
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
                <SearchResult url="/nothing" text="result1" />
                <SearchResultDivider />
                <SearchResult url="/nothing" text="result2" />
            </span>
        );
    }
}


class SearchResult extends React.Component {
    /**
     * Props:
     * url: str, url to redirect to if result is clicked
     * text: str, text to display in result
     */
    render() {
        return (
            <Link to={this.props.url}>
                <div className='search-result'>{this.props.text}</div>
            </Link>
        );

    }
}

class SearchResultDivider extends React.Component {
    render () {
        return (
            <div className='search-divider'>
                <div className='search-divider-bar' />
            </div>
        );
    }
}



export class SearchOverlay extends React.Component {
    /**
     * props
     * active: bool, true if overlay should display
     * onDismissed: fn, callback when user dismisses search overlay
     */
    // constructor(props) {
    //     super(props);
    // }

    render() {
        let overlayClass = classNames({
            "hidden": !this.props.active
        });
        return (
            <div id="search-container" className={overlayClass}>
                <div id="search-background" 
                     className={overlayClass}
                     onClick={() => this.props.onDismissed(false)} />

                <SearchBox active={this.props.active}
                           placeholder='Search TBD...'/>
            </div>
        );
    }
}