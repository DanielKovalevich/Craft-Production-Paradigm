import {Game} from "./game";

export interface HashMap {
    [key: number] : Game;
}

// let test: HashMap = {};         <--- Declaration
// test[1111] = new Game();        <--- Setting
// let value: Game = test[1111];   <--- Getting