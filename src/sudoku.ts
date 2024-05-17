import {CSP, CSPOptions } from './CSP';
import { createCSP } from './CSP';
import { deepCopy } from './utils';
export type SudokuBoard = number[][];
export type SudokuChoice = number;
export const SudokuEmpty: SudokuChoice = -1;
export const sudokuChoices = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	
const findEmptySpot = (board: SudokuBoard): [number, number] | null => {
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			if (board[i][j] === SudokuEmpty) return [i,j];
		}
	}
	return null;
}
const getSudokuChoices = (board: SudokuBoard): SudokuChoice[] => {
	return sudokuChoices;
}
const sudokuCompose = (board: SudokuBoard, sudokuChoice: SudokuChoice): SudokuBoard => {
	const [i, j] = findEmptySpot(board)!;
	board[i][j] = sudokuChoice;
	return board;
}
const sudokuConstraintSatisfaction = (board: SudokuBoard, choice: SudokuChoice): boolean => {
	const emptySpot = findEmptySpot(board);
	if (!emptySpot) return false;
	const [y, x] = emptySpot;
	for ( let i = 0; i < 9; i++ ) {
		if ( board[ y ][ i ] === choice ) return false;
	}
	// check column
	for ( let i = 0; i < 9; i++ ) {
		if ( board[ i ][ x ] === choice ) return false;
	}
	// check block
	const bh = Math.floor( x / 3 );
	const bv = Math.floor( y / 3 );
	for ( let i = 0; i < 3; i++ ) {
		for ( let j = 0; j < 3; j++ ) {
			const cx = j + bh * 3;
			const cy = i + bv * 3;
			if ( board[ cy ][ cx ] === choice ) return false;
		}
	}
	return true;
}
const sudokuDone = (board: SudokuBoard): boolean => {
	return !findEmptySpot(board);
}

export function sudokuSolver( sudokuBoard: SudokuBoard ) {

	const options = {randomized: false} as CSPOptions;
	const csp = createCSP(
		sudokuBoard, 
		getSudokuChoices, 
		sudokuCompose, 
		sudokuConstraintSatisfaction, 
		sudokuDone, 
		options
	);
	return csp;
}

const boardTemplate = [
	[ -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
	[ -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
	[ -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
	[ -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
	[ -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
	[ -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
	[ -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
	[ -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
	[ -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
]
export const initialBoard = deepCopy( boardTemplate );
initialBoard[ 1 ][ 1 ] = 1;
initialBoard[ 1 ][ 3 ] = 8;
initialBoard[ 1 ][ 5 ] = 9;
initialBoard[ 1 ][ 7 ] = 4;

initialBoard[ 2 ][ 1 ] = 2;
initialBoard[ 2 ][ 5 ] = 3;
initialBoard[ 2 ][ 6 ] = 7;
initialBoard[ 2 ][ 7 ] = 9;


initialBoard[ 3 ][ 2 ] = 6;
initialBoard[ 3 ][ 3 ] = 7;
initialBoard[ 3 ][ 7 ] = 3;


initialBoard[ 5 ][ 1 ] = 9;
initialBoard[ 5 ][ 3 ] = 3;
initialBoard[ 5 ][ 5 ] = 1;
initialBoard[ 5 ][ 6 ] = 2;
initialBoard[ 5 ][ 7 ] = 6;


initialBoard[ 6 ][ 1 ] = 4;
initialBoard[ 6 ][ 2 ] = 3;
initialBoard[ 6 ][ 7 ] = 1;

initialBoard[ 7 ][ 1 ] = 7;
initialBoard[ 7 ][ 3 ] = 1;
initialBoard[ 7 ][ 5 ] = 4;
initialBoard[ 7 ][ 6 ] = 6;


function valid (arr: SudokuBoard) {
	// check rows
	for ( let y = 0; y < 9; y++ ) {
		const row = [];
		for ( let i = 0; i < 9; i++ ) {
			if ( row[ arr[ y ][ i ] ] ) {
				return false;
			} else row[ arr[ y ][ i ] ] = 1;
		}
	}
	// check column
	for ( let x = 0; x < 9; x++ ) {
		const col = [];
		for ( let i = 0; i < 9; i++ ) {
			if ( col[ arr[ i ][ x ] ] ) {
				return false;
			} else col[ arr[ i ][ x ] ] = 1;
		}
	}
	// check block

	for ( let y = 0; y < 3; y++ ) {
		for ( let x = 0; x < 3; x++ ) {
			const block = [];
			const bh = x;
			const bv = y
			for ( let i = 0; i < 3; i++ ) {
				for ( let j = 0; j < 3; j++ ) {
					const cx = j + bh * 3;
					const cy = i + bv * 3;
					if ( block[arr[ cy ][ cx ]] ) {
						return false;
					} else block[arr[cy][cx]] = 1;
				}
			}
		}
	}
	return true;
}
// now let's do an experiment in generating sudoku boards
function randomSudokuBoard ( density: number = 0.1 ): SudokuBoard {

	const block = [];
	for ( let i = 0; i < 9; i++ ) {
		const col = [];
		for ( let j = 0; j < 9; j++ ) {
			if ( Math.random() > density ) col.push( -1 );
			else {
				col.push( Math.floor( Math.random() * 9 ) + 1 );
			}
		}
		block.push( col );
	}
	return block
}