"use strict";
import * as bunyan from 'bunyan';
import * as fs from 'fs';

import { Scoreboard, GameStates, Game } from '../common/types';
import { MLBClient } from '../common/mlb_client';
import { toFileName } from '../common/util';

var log = bunyan.createLogger({
    name: 'scoreboard-loader',
    level: 'TRACE'
});

/**
 * Load games for given date
 * @param date : Date object
 * @param force : boolean whether to force update
 * @return Scoreboard scoreboard of games on specified date
 */
export async function loadScores(date: Date, force: boolean = false) {
    log.info(`Loading scoreboard for ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`);

    let filename = "./data/games/" + toFileName(`${date.toDateString()}`, '.json');
    let scoreboard: Scoreboard = null;

    /* Check to see if date is cached */
    let exists = await fs.exists(filename);
    if (exists && !force) {
        log.info(`Found cached game.`);
        try {
            let scoreboard = JSON.parse(fs.readFileSync(filename).toString());
        } catch(err){
            log.error(`Failed to read ${filename}: ${err}`);
            throw err;
        }
    } else {
        log.info(`No game data for ${filename}, fetching...`);
        scoreboard = new Scoreboard(date);
        log.info(`Created scoreboard: ${scoreboard.toString()}`);

        let client = new MLBClient(date);
        log.info(`Created client: ${client.toString()}`);

        let games: Game[] = await client.getGames();
        for (var game of games) {
            scoreboard.addGame(game);
        }

        log.info(`Loaded scoreboard with ${scoreboard.numGames()} games.`);
        try {
            fs.writeFileSync(filename, JSON.stringify(scoreboard));
        } catch (err) {
            log.error(`Error writting ${filename}: ${err}`);
            throw err;
        }
        log.info(`Successfully updated ${filename}`);
    }

    return scoreboard;
}

