import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import FontAwesome from 'react-fontawesome';

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
        if (this.isAppearing(this.props, nextProps)) {
            this.setState({
                focused: true,
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.isAppearing(prevProps, this.props)) {
            console.log('Focusing input');
            this.searchInput.focus();
        }
    }

    isAppearing(startProps, endProps) {
        return !startProps.active && endProps.active;
    }

    onInputChanged(event) {
        console.log('Search input changed!');
    }

    onInputFocus(event) {
        console.log('focus');
        console.log(event);
        if (event === 'blurred') this.setState({ focused: false });
        else if (event === 'focused') this.setState({ focused: true });
    }

    render() {
        let modalClass = classNames('search-modal', {
            'focused': this.state.focused,
            'hidden': !this.props.active,
        });
        return (
            <div className={modalClass}>
                <FontAwesome className='fa fa-search'
                             name='search'
                             size='2x'/>
                <input type='text' 
                       ref={(input) => this.searchInput = input}
                       className='search-input'
                       placeholder={this.props.placeholder}
                       onChange={this.onInputChanged.bind(this)}
                       onBlur={() => this.onInputFocus('blurred')}
                       onFocus={() => this.onInputFocus('focused')}>
                </input>
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