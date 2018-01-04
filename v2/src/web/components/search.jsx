import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import FontAwesome from 'react-fontawesome';

import '../style/search.scss';

export class SearchBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false,
        };
    }

    componentDidMount() {
        // Animate focus when search bar first appears
        setTimeout(() => this.setState({ focused: true }), 1000);
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
        let modalClass = classNames('search-modal', {focused: this.state.focused});
        return (
            <div className={modalClass}>
                <FontAwesome className='fa fa-search'
                             name='search'
                             size='2x'/>
                <input type='text' 
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
                     onClick={() => this.props.onDismissed()} />
                <SearchBox placeholder='Search TBD...'/>
            </div>
        );
    }
}