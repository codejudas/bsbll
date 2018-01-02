import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import '../style/search.scss';

export class SearchOverlay extends React.Component {
    /**
     * props
     * active: bool, true if overlay should display
     */
    // constructor(props) {
    //     super(props);
    // }

    render() {
        let overlayClass = classNames({
            "hidden": !this.props.active
        });
        return (
            <div id="search-overlay" className={overlayClass}>
                SEARCH!
            </div>
        );
    }
}