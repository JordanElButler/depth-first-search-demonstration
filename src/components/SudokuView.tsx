import React from 'react';
import {sudokuSolver, initialBoard} from '../sudoku';
import './Sudoku.css';
type BlockProps = {
	x: number,
	y: number,
	children: React.ReactNode,
}
function SudokuBlock({x, y, children}: BlockProps) {
	const style = {
		gridColumn: x+1,
		gridRow: y+1,
	}
	
	return (
		<div style={style} className={'sudoku-block'}>
			{children}
		</div>
	)
}
type CellProps = {
	val: string,
	x: number,
	y: number,
}
function SudokuCell({val, x, y}: CellProps ) {
	const style = {
		gridColumn: x+1,
		gridRow: y+1,
	}
	return (
		<div style={style} className={'sudoku-cell'}>
			{val}
		</div>
	)
}
function SudokuView() {
	
	const [sudokuGame, setSudokuGame] = React.useState(sudokuSolver(initialBoard))
	const [run, setRun] = React.useState(true);
	const time = 1000/60;
	
	React.useEffect(() => {
		const intervalId = setInterval(() => {
			sudokuGame.step();
			setSudokuGame({...sudokuGame
			});
		}, time);
		
		return () => clearInterval(intervalId);
	}, []);
	
	const board = sudokuGame.getSudokuBoard();
	
	const blocks = [];
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			const cells = []
			for (let y = 0; y < 3; y++) {
				for (let x = 0; x < 3; x++) {
					const val = board[y + 3 * i][x + 3 * j];
					cells.push(
						<SudokuCell key={`${x}-${y}`}x={x} y={y} val={val === -1 ? '' : val.toString()} />
					)
				}
			}
			blocks.push(
				<SudokuBlock key={`${j}-${i}`} x={j} y={i} children={cells} />	
			)
		}
	}
	let message = '';
	const steps = sudokuGame.getSteps();
	if (sudokuGame.failed()) {
		setRun(false);
		message = `failed at step ${steps}`;
	} else if (sudokuGame.done()) {
		message = `Solved at step ${steps}`;
	} else {
		message = `steps ${steps}`;
	}
	return (
		<>
		<div>{message}</div>
		<div className={'sudoku-block'}>
			{blocks}
		</div>
		</>

	);
}

export default SudokuView;