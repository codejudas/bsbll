import {toFileName} from './util';
export class Scoreboard {

    date: Date;
    final_games: Game[];
    live_games: Game[];
    upcoming_games: Game[];
    postponed_games: Game[];

    constructor(date: Date) {
        this.date = date;
        this.final_games = new Array<Game>();
        this.live_games = new Array<Game>();
        this.upcoming_games = new Array<Game>();
        this.postponed_games = new Array<Game>();
    }

    addGame(game: Game) {
        if (game.state == GameStates.Final) this.final_games.push(game);
        if (game.state == GameStates.Live) this.live_games.push(game);
        if (game.state == GameStates.Upcoming) this.upcoming_games.push(game);
        if (game.state == GameStates.Postponed) this.postponed_games.push(game);
    }

    numGames() : number {
        return this.final_games.length + this.live_games.length +
                this.upcoming_games.length + this.postponed_games.length;
    }

    activeGames() : number {
        return this.live_games.length + this.upcoming_games.length;
    }

    toString() : string {
        return `<Scoreboard ${this.date.toISOString()}>`
    }

}

export enum GameStates { Final, Upcoming, Live, Postponed };

export abstract class Game {
    public static readonly TEAM_ICON_PATH_PREFIX = "/assets/img/teams/";
    public static readonly PITCHER_PATH_PREFIX = "/assets/img/players/";


    public date: Date;
    abstract readonly state: GameStates;

    public home_team: string;
    public away_team: string;

    public home_team_icon: string;
    public away_team_icon: string;

    public away_record: [number, number];
    public home_record: [number, number];

    constructor(date: Date, raw_game: any) {
        this.date = date;
        this.away_team = raw_game["away_team_city"];
        this.home_team = raw_game["home_team_city"];
        this.away_team_icon = Game.TEAM_ICON_PATH_PREFIX + toFileName(this.away_team, '.png');
        this.home_team_icon = Game.TEAM_ICON_PATH_PREFIX + toFileName(this.home_team, '.png');
        this.away_record = [parseInt(raw_game['away_win']), parseInt(raw_game['away_loss'])];
        this.home_record = [parseInt(raw_game['home_win']), parseInt(raw_game['home_loss'])];
    }

    /* Builder Pattern? */

    toString(): string {
        return `<${this.state.toString()} Game ${this.date.toISOString()}>`
    }
}

export class FinalGame extends Game {
    public readonly state = GameStates.Final;

    public display_status: string;

    public inning: number;
    public winner: string;

    public away_score: number;
    public home_score: number;

    public away_pitcher: string;
    public away_pitcher_record: [number, number];
    public away_pitcher_era: number;
    public away_pitcher_img: string;

    public home_pitcher: string;
    public home_pitcher_record: [number, number];
    public home_pitcher_era: number;
    public home_pitcher_img: string;

    constructor(date: Date, raw_game: any) {
        super(date, raw_game);

        this.display_status = raw_game['status']['status'];
        this.away_score = parseInt(raw_game["linescore"]["r"]["away"]);
        this.home_score = parseInt(raw_game["linescore"]["r"]["home"]);
        this.inning = parseInt(raw_game['status']['inning'])
        this.winner = this.away_score > this.home_score ? "away" : "home";

        let away_pitcher_data = this.winner == "away" ? raw_game["winning_pitcher"] : raw_game["losing_pitcher"];
        let home_pitcher_data = this.winner == "home" ? raw_game["winning_pitcher"] : raw_game["losing_pitcher"];

        this.away_pitcher = away_pitcher_data["first"] + " " + away_pitcher_data["last"];
        this.away_pitcher_record = [parseInt(away_pitcher_data["wins"]), parseInt(away_pitcher_data["losses"])];
        this.away_pitcher_era = parseFloat(away_pitcher_data["era"]);
        this.away_pitcher_img = Game.PITCHER_PATH_PREFIX + toFileName(this.away_pitcher, '.png');

        this.home_pitcher = home_pitcher_data["first"] + " " + home_pitcher_data["last"];
        this.home_pitcher_record = [parseInt(home_pitcher_data["wins"]), parseInt(home_pitcher_data["losses"])];
        this.home_pitcher_era = parseFloat(home_pitcher_data["era"]);
        this.away_pitcher_img = Game.PITCHER_PATH_PREFIX + toFileName(this.home_pitcher, '.png');

        // TODO: PITCHER IMAGES
    }

    winningPitcher() {}
    losingPitcher() {}

}

export class LiveGame extends Game {
    public readonly state = GameStates.Live;

    constructor(date: Date, raw_game: any) {
        super(date, raw_game);

    }

    winningPitcher() {}
    losingPitcher() {}

}

export class UpcomingGame extends Game {
    public readonly state = GameStates.Upcoming;

    constructor(date: Date, raw_game: any) {
        super(date, raw_game);
    }

    winningPitcher() {}
    losingPitcher() {}

}

export class PostponedGame extends Game {
    public readonly state = GameStates.Postponed;

    constructor(date: Date, raw_game: any) {
        super(date, raw_game);
    }

    winningPitcher() {}
    losingPitcher() {}

}