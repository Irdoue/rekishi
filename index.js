const fs = require('fs');
const chalk = require('chalk');
const clear = require('clear');

const exit = (errorMessage) => {
    console.log(errorMessage);
    process.exit();
};

const fileName = process.argv[2];

let gameInformation ;
try{
    gameInformation = fs.readFileSync(fileName, 'utf-8').split(';');
} catch {
    exit('There is no party under this name here.');
}
const size = parseInt(gameInformation.shift());
if (size < 1 ) exit('The size must be more than 0.');
if (isNaN(size)) exit('Invalid size.');
console.log(size)
const blackPlayer = gameInformation.shift();
if (typeof(blackPlayer) != 'string') exit('The black\'s player has no name.');
const whitePlayer = gameInformation.shift();
if (typeof(whitePlayer) != 'string') exit('The white\'s player has no name.');


/** 
 * Make the empty board by puting the board's parts together.
 * @return {string[]} - A list of string that are pieces of the board in the right order.
 */
const makeEmptyBoard = () => {
    () => size > 9 ?? ' ';
    const assembleBoardPieces = (pieces) => [pieces[0], Array(size - 1).fill(pieces[1]), pieces[2]].flat(2);
    const boardTop = assembleBoardPieces(['   ┌────', '┬────', '┐\n']);
    const boardMiddle = assembleBoardPieces(['│    ','│    ', '│\n']).concat(assembleBoardPieces(['   ├────' ,'┼────', '┤\n']));
    const boardBottom = assembleBoardPieces(['│    ','│    ', '│\n']).concat(assembleBoardPieces(['   └────', '┴────', '┘\n']));
    let assembledBoardPieces = assembleBoardPieces([boardTop, boardMiddle, boardBottom]);
    return assembledBoardPieces;
};

let emptyBoard = makeEmptyBoard();

/**
 * The move's token.
 * @typedef {Object} Token
 * @property {string} black - The black token
 * @property {string} white - The white token
 * @property {string} empty - The empty token
 */
const tokens = {
    white: '│ ' + chalk.white('██ '),
    black: '│ ' + chalk.black('██ '),
    empty: '│    ',
};

/**
 * Return a 'move' object that content the information of a move.
 * @param {string} information - A string that content all the information of the move
 * @return {{
 *  color: string,
 *  x: number,
 *  y: number,
 * }}
 */
const makeMove = (information, index) => {
    let move = {};
    let processedInformation = information.split(':');
    move.color = processedInformation[0][0] === '-' ? 'empty' :  
        processedInformation[0][0] === '+' ? processedInformation[0][1] === 'b' ? 'black' : 
            processedInformation[0][1] === 'w' ? 'white' :
        exit(`Invalid color at move ${index + 1}.`) : 
    exit(`Missing + or - at move ${index + 1}.`) ;
    move.x = parseInt(processedInformation[1][0].charCodeAt(0) - 96 - 0**(processedInformation[1][0].charCodeAt(0) <= 104));
    move.y = parseInt(/[0-9]{1,}/g.exec(processedInformation[1])[0]);
    if (move.x > size || move.y > size) exit(`The move ${index + 1} is outside the board.`);
    return move;
};

const gameMoves = gameInformation.map((move, index) => makeMove(move, index));

/** 
 * Put the good string at the rigth place in the board list.
 * @param {string[]} board - A list of string that represent the present board
 * @param {object} move - A 'move' object
 * @return {string[]} - The new board with the move played.
 */
const playMove = (move, board = emptyBoard) => {
    let newBoard = [...board];
    newBoard[2 * (move.y - 1) * (size + 1) + size + move.x] = tokens[move.color];
    return newBoard
};

/**
 * Make all the boards and put them in a list.
 * @param {Move[]} gameMoves - The list of all moves of the game
 * @returns {string[][]} - The list of all the boards of the game
 */
const makeAllBoards = (moves) => {
    let allBoards = [];
    let board;
    let badIndex = moves.map((move, index) => {if (move.color === 'empty'){return index - 1;}}).filter((index) => index !== undefined);
    let letterLine = '    ';
    for (let i = 0; i < size; i++){
            letterLine += '  ' + String.fromCharCode(65 + i + 0**(i < 8)) + '  ';
    }
    for (let i = 0; i < moves.length; i++){
        board = playMove(moves[i], board);
        if (!badIndex.includes(i)){
            allBoards.push(board);
        }
    }
    for (let i = 0; i < allBoards.length; i++){
        for (let j = 0; j < size; j++){
            allBoards[i][2 * (j + 1/2) * (size + 1)] = `${j + 1 < 10 ? ' ' : ''}` + (j + 1).toString() + ' ' + allBoards[i][2 * (j + 1/2) * (size + 1)];
        }
        allBoards[i].unshift(letterLine + '\n');
    }
    return allBoards;
};

const allBoards = makeAllBoards(gameMoves);

/**
 * Display the board with some informations.
 * @param {string[][]} boards - The boards of the game that you want to display
 * @param {number} turn - The number of the actual turn
 */
const displayBoard = (boards, turn) => {
    clear();
    const boardsLength = boards.length;
    console.log(chalk.bgWhiteBright(boards[turn].join('') + `\nTurn: ${turn + 1}/${boardsLength} │ Size: ${size}x${size} │ ${blackPlayer}(b) vs ${whitePlayer}(w)`));
};

const gameLoop = () => {
    let i = 0;
    displayBoard(allBoards, i);
    process.stdin.setRawMode(true);
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (key) => {
       if (key === '\u001b[D'){
        i--;
        displayBoard(allBoards, i);
       }
       if (key === '\u001b[C'){
        i++;
        displayBoard(allBoards, i);
       }
       if (key === 'c') exit();
    });
};
gameLoop();