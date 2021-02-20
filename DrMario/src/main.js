'use strict'

import { Game } from './components/Game.js';


let game;
document.querySelector('button').addEventListener('click', () => {
    if (game) game.pause();
    game = new Game();
    game.start();
    document.querySelector('audio').play();
    document.querySelector('audio').currentTime = 0;;

});
