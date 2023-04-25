# Rekishi

Replay Go games in the terminal. 

## Usage

Execute `rekishi.js` in your terminal with a `.rek` file as the first argument.
Use the arrow keys to navigate in the game.

The `.rek` file is used to write games you want read :
- Dimension of the goban _(a single integer)_.
- Name of the players _(black first, white second)_.
- Ordered list of board modifications:
    - Adding a stone `+` or removing it `-`.
    - The color of the player `w`: _white_ or `b`: _black_ _(removing a stone will  not have_.
    - The position of the stone, example: `b4`.
    
### Example :
`4;BlackPlayer;WhitePlayer;+b:a2;+w:d5;...`
