import React from 'react';
import { tileSolver, initialBoard, TileEmpty, getTileColor } from '../tiles';
import {randomColor} from '../utils';
import CSPControls from './CSPControls';
import './Tile.css';
import '../App.css';

type TileProps = {
	x: number,
	y: number,
	text: string,
	col: string,
}
function Tile ( { x, y, text, col }: TileProps ) {
	const style = {
		gridRow: `${ y + 1 }`,
		gridColumn: `${ x + 1 }`,
		backgroundColor: col,
	}
	return (
		<div style={ style } className={ 'tile' }>
			{ text }
		</div>
	)
}
export type TileViewProps = {	
	refTarget: React.MutableRefObject<HTMLElement | undefined>
}
function TileView ({refTarget}: TileViewProps) {
	const [ tileCSP, setTileCSP ] = React.useState( tileSolver( initialBoard ) );
	const [ run, setRun ] = React.useState( true );
	const [time, setTime] = React.useState(1000/2);
	const [colors, setColors] = React.useState(new Array(200).fill(-1).map(_ => randomColor()));
	
	const fail = tileCSP.fail();
	const done = tileCSP.done();
	React.useEffect( () => {
		const intervalId = setInterval( () => {
			if (!run || fail || done) return;
			tileCSP.step();
			setTileCSP( {
				...tileCSP
			} );
		}, time );
		return () => clearInterval(intervalId);
	}, [run, time, fail, done] );

	const { w, h, board } = tileCSP.getState();
	const grayColor = 'rgb(128, 128, 128)';
	const style = {
		gridTemplateRows: `repeat(${ h }, 1fr)`,
		gridTemplateColumns: `repeate(${ w }, 1fr)`,
		width: `${20*w}px`,
		height: `${20*h}px`,
	}
	const tiles = [];
	for ( let i = 0; i < h; i++ ) {
		for ( let j = 0; j < w; j++ ) {
			const val = board[ i ][ j ]
			const text = val.index === TileEmpty ? '' : board[ i ][ j ].index.toString();
			const col = val.index !== TileEmpty ? colors[val.index] : '';
			tiles.push(
				<Tile key={ `${ j }-${ i }` } x={ j } y={ i } text={ text } col={col} />
			)
		}
	}
	
	let message = '';
	const steps = tileCSP.getSteps();
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
			<div style={ style } className={ 'tile-container' }>
				{ tiles }
			</div>
		</div>
	)
}

export default TileView;