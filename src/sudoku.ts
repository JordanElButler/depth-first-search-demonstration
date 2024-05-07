
function deepArrayCopy ( arr: any ): any[] | any {
	if ( arr instanceof Array ) {
		return arr.map( a => deepArrayCopy( a ) );
	} else return arr;
}
const randomArray = ( n: number ): number[] => {
	const arr: number[] = [];
	for ( let i = 0; i < n; i++ ) arr.push( i );
	for ( let i = 0; i < n; i++ ) {
	  const j = Math.floor( Math.random() * ( n - i ) ) + i;
	  const tmp = arr[ j ];
	  arr[ j ] = arr[ i ];
	  arr[ i ] = tmp;
	}
	return arr;
  }
  
export type SudokuBoard = number[][];

export function sudokuSolver( sudokuBoard: SudokuBoard ) {

	let steps = 0;
	// construct sudokuState
	const initialBoard: SudokuBoard = [];
	for ( let i = 0; i < 9; i++ ) {
		const tmp = [];
		for ( let j = 0; j < 9; j++ ) {
			if ( sudokuBoard[ i ][ j ] !== -1 ) {
				tmp.push( sudokuBoard[ i ][ j ] );
			} else tmp.push( -1 );
		}
		initialBoard.push( tmp );
	}
	
	const stack = [
		{ board: initialBoard, ti: 1 }
	]

	function step (  ) {
		if (done()) return;
		console.log(stack.length);
		steps += 1;
		const { board, ti } = stack.pop()!;

		// find empty
		let emptySpot = null;
		let found = false;
		for ( let i = 0; i < 9 && !found; i++ ) {
			for ( let j = 0; j < 9 && !found; j++ ) {
				if ( board[ i ][ j ] === -1 ) {
					emptySpot = [ i, j ];
					found = true;
				}
			}
		}
		for ( let tt = ti; tt <= 9; tt++ ) {
			const [ y, x ] = emptySpot!;
			let falseFlag = false;
			// check row
			for ( let i = 0; i < 9 && !falseFlag; i++ ) {
				if ( board[ y ][ i ] === tt ) {
					falseFlag = true;
				}
			}
			// check column
			for ( let i = 0; i < 9 && !falseFlag; i++ ) {
				if ( board[ i ][ x ] === tt ) {
					falseFlag = true;
				}
			}
			// check block
			const bh = Math.floor( x / 3 );
			const bv = Math.floor( y / 3 );
			for ( let i = 0; i < 3 && !falseFlag; i++ ) {
				for ( let j = 0; j < 3; j++ ) {
					const cx = j + bh * 3;
					const cy = i + bv * 3;
					if ( board[ cy ][ cx ] === tt ) {
						falseFlag = true;
					}
				}
			}
			if ( falseFlag ) continue;
			// if all good
			const newBoard = deepArrayCopy( board );
			newBoard[ y ][ x ] = tt;
			stack.push( {
				board,
				ti: tt + 1,
			} );
			stack.push( {
				board: newBoard,
				ti: 1,
			} );
			return;
		}
	}

	function done (  ) {
		const { board, ti } = stack[ stack.length - 1 ];
		for ( let i = 0; i < 9; i++ ) {
			for ( let j = 0; j < 9; j++ ) {
				if ( board[ i ][ j ] === -1 ) return false;
			}
		}
		return true;
	}

	function failed ( ) {
		return stack.length === 0;
	}
	
	function getSudokuBoard(): SudokuBoard {
		if (stack.length === 0) return initialBoard;
		return stack[stack.length - 1].board;
	}
	function getSteps(): number {
		return steps;
	}
	return {
		initialBoard,
		step,
		done,
		failed,
		getSudokuBoard,
		getSteps,
	}
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
export const initialBoard = deepArrayCopy( boardTemplate );
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
let ss = sudokuSolver( initialBoard );

/*
next step make the sudoku board editable, 
change colors,
change font to something better,
clean up api
*/