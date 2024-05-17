import React from 'react';
import CSPControls from './CSPControls';
import { Maze, MazeEnum, mazeSolver, initialMaze, } from '../maze';
import './Maze.css';
import '../App.css';


export type MazeCellProps = {
	x: number,
	y: number,
	cellType: MazeEnum,
}
function MazeCell({x, y, cellType}: MazeCellProps) {
	let cellClass;
	if (cellType === MazeEnum.wall) cellClass = 'cell-wall';
	else if (cellType === MazeEnum.empty) cellClass = 'cell-empty';
	else if (cellType === MazeEnum.entrance) cellClass = 'cell-entrance';
	else if (cellType === MazeEnum.exit) cellClass = 'cell-exit';
	else if (cellType === MazeEnum.body) cellClass = 'cell-body';
	else if (cellType === MazeEnum.head) cellClass = 'cell-head';
	const style = {
		gridRow: `${y + 1}`,
		gridColumn: `${x + 1}`,
	}
	
	return (
		<div style={style} className={`maze-cell ${cellClass}`}></div>
	)
}
export type MazeViewProps = {
	refTarget: React.MutableRefObject<HTMLElement | undefined>
}
function MazeView({refTarget}: MazeViewProps) {
	const [mazeCSP, setMazeCSP] = React.useState(mazeSolver(initialMaze));
	const [time, setTime] = React.useState(1000/2);
	const [run, setRun] = React.useState(true);
	const fail = mazeCSP.fail();
	const done = mazeCSP.done();
	
	React.useEffect(() => {
		const intervalId = setInterval(() => {
			if (!run || fail || done) return;
			mazeCSP.step();
			setMazeCSP({
				...mazeCSP
			});
			
		}, time);
		return () => clearInterval(intervalId);
	}, [time, run, fail, done])
	
	const maze: Maze = mazeCSP.getState();
	const mazeCells = []
	for (let i = 0; i < maze.length; i++) {
		for (let j = 0; j < maze[i].length; j++) {
			mazeCells.push(
				<MazeCell key={`${j}-${i}`} x={j} y={i} cellType={maze[i][j]} />
			)
		}
	}
	
	const style = {
		gridTemplateRows: `repeat(${maze.length}, 1fr)`,
		gridTemplateColumns: `repeat(${maze[0].length}, 1fr)`,
		width: `${20 * maze[0].length}px`,
		height: `${20 * maze.length}px`,
	}
	
	let message = '';
	const steps = mazeCSP.getSteps();
	if (fail) {
		message = `failed at step ${steps}`;
	} else if (done) {
		message = `Solved at step ${steps}`;
	} else {
		message = `steps ${steps}`;
	}
	return (
		<div ref={refTarget} className={'component'}>
			<div>{`${message}`}</div>
			<CSPControls failOrDone={fail || done} playState={run} setPlayState={setRun} time={time} setTime={setTime} />
			<div className={'maze-container'}>
				{mazeCells}
			</div>
		</div>
	)
}

export default MazeView;