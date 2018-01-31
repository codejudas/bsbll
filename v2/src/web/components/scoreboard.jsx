import React from 'react';
import ReactDOM from 'react-dom';

import {getPageTitle} from '../util';

import '../style/scoreboard.scss';

const CARDS_PER_ROW = 3;

export class Scoreboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.state.games = [{}, {}, {}, {}];
    }

    render() {
        return (
            <div id='scoreboard'>
                <div className='scoreboard-row'>
                    <GameCard />
                    <GameCard />
                    <GameCard />
                    <GameCard />
                </div>
            </div>
        );
    }
}

export class GameCard extends React.Component {
    render() {
        return (
            <div className='gamecard'>Game</div>

        );
    }

}
