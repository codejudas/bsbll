import * as webrequest from 'web-request';
import * as bunyan from 'bunyan';
import { sprintf } from 'sprintf-js';
import { Scoreboard, Game, FinalGame, LiveGame, UpcomingGame, PostponedGame } from './types';

var log = bunyan.createLogger({
    name: 'mlb-client',
    level: 'TRACE'
});

export class MLBClient {
    static BASE_URL: string = 'http://gd2.mlb.com/components/game/mlb/year_%04d/month_%02d/day_%02d/master_scoreboard.json';

    url: string;
    date: Date;

    constructor(date: Date) {
        this.date = date;
        this.url = sprintf(MLBClient.BASE_URL, date.getFullYear(), date.getMonth() + 1, date.getDate());
    }

    /**
     * Load game data for this.date
     * @returns Games[]
     */
    async getGames() : Promise<Game[]> {
        try {
            let result = await webrequest.json<any>(this.url, {method: 'GET', throwResponseError: true});
            if (!result) throw new Error('Empty result set.');
            return this.parse(result);
        } catch(err) {
            log.error(`Unable to get ${this.url}`);
            log.error(`Error ${err}`);
            throw err;
        }
    }

    protected parse(game_data: any) : Game[] {
        try {
            game_data = game_data['data']['games']['game'];
        } catch(err) {
            log.warn('Invalid game data received from MLB.');
            log.warn(`Game data: ${JSON.stringify(game_data, null, 2)}`)
            return [];
        }

        if (!Array.isArray(game_data)) {
            log.warn('Game data is not an array.');
            return [];
        }

        let games = [];
        for(var i in game_data) {
            let game = null;

            try {
                // Normalize game status
                let raw_game = game_data[i];
                let game_status = raw_game['status']['status'].toLowerCase().trim();
                game_status = game_status.replace(/ /g, '');
                switch(game_status) {
                    case 'inprogress':
                    case 'delayedstart':
                        game = new LiveGame(this.date, raw_game);
                        break;
                    
                    case 'gameover':
                    case 'final':
                    case 'completedearly':
                        game = new FinalGame(this.date, raw_game);
                        break;
                    
                    case 'postponed':
                    case 'suspended':
                    case 'cancelled':
                        game = new PostponedGame(this.date, raw_game);
                        break;
                    
                    case 'preview':
                        game = new UpcomingGame(this.date, raw_game);
                        break;
                    
                    default:
                        log.warn(`Unknown game type ${game_status}`);
                        continue;
                }
            } catch(err) {
                log.error(`Unable to parse game #${i}`);
                log.error(`Error ${err}`);
                log.error(`Stacktrace ${err.stack}`);
            }

            if (game) games.push(game);
        }

        return games;
    }

    toString() {
        return `<MLBClient ${this.url}>`;
    }
}