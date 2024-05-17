import React from 'react';
import { sudokuSolver, initialBoard, SudokuEmpty } from '../sudoku';
import CSPControls from './CSPControls';
import './Sudoku.css';
import '../App.css';

type BlockProps = {
	x: number,
	y: number,
	children: React.ReactNode,
}
function SudokuBlock ( { x, y, children }: BlockProps ) {
	const style = {
		gridColumn: x + 1,
		gridRow: y + 1,
	}

	return (
		<div style={ style } className={ 'sudoku-block' }>
			{ children }
		</div>
	)
}
type CellProps = {
	val: string,
	x: number,
	y: number,
}
function SudokuCell ( { val, x, y }: CellProps ) {
	const style = {
		gridColumn: x + 1,
		gridRow: y + 1,
	}
	return (
		<div style={ style } className={ 'sudoku-cell' }>
			{ val }
		</div>
	)
}
export type SudokuViewProps = {
	refTarget:  React.RefObject<HTMLDivElement>
}
function SudokuView ( { refTarget }: SudokuViewProps ) {

	const [ sudokuCSP, setSudokuCSP ] = React.useState( sudokuSolver( initialBoard ) )
	const [ run, setRun ] = React.useState( true );
	const [ time, setTime ] = React.useState( 1000 / 2 );
	const fail = sudokuCSP.fail();
	const done = sudokuCSP.done();

	React.useEffect( () => {
		const intervalId = setInterval( () => {
			if ( !run || fail || done ) return;
			sudokuCSP.step();
			setSudokuCSP( {
				...sudokuCSP
			} );
		}, time );

		return () => clearInterval( intervalId );
	}, [ time, run, fail, done ] );

	const board = sudokuCSP.getState();

	const blocks = [];
	for ( let i = 0; i < 3; i++ ) {
		for ( let j = 0; j < 3; j++ ) {
			const cells = []
			for ( let y = 0; y < 3; y++ ) {
				for ( let x = 0; x < 3; x++ ) {
					const val = board[ y + 3 * i ][ x + 3 * j ];
					cells.push(
						<SudokuCell key={ `${ x }-${ y }` } x={ x } y={ y } val={ val === SudokuEmpty ? '' : val.toString() } />
					)
				}
			}
			blocks.push(
				<SudokuBlock key={ `${ j }-${ i }` } x={ j } y={ i } children={ cells } />
			)
		}
	}

	const steps = sudokuCSP.getSteps();
	let message = '';
	if ( fail ) {
		message = `failed at step ${ steps }`;
	} else if ( done ) {
		message = `Solved at step ${ steps }`;
	} else {
		message = `steps ${ steps }`;
	}
	return (
		<div ref={ refTarget } className={ 'component' }>
			<div>{ message }</div>
			<CSPControls failOrDone={ fail || done } playState={ run } setPlayState={ setRun } time={ time } setTime={ setTime } />
			<div className={ 'sudoku-container' }>
				{ blocks }
			</div>
		</div>

	);
}

export default SudokuView;