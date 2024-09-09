import React from 'react';
import styles from './CSPControls.module.css';

type TimerIntervals = {
	intervals: number[],
	bottom: () => boolean,
	top: () => boolean,
	down: () => boolean,
	up: () => boolean,
	getValue: () => number,
}
function createTimerInterval(min: number, max: number, interval: number): TimerIntervals {
	const intervals: number[] = [];
	for (let i = min; i <= max; i += interval) {
		intervals.push(i);
	}
	
	let index = Math.floor(intervals.length / 2);
	
	const bottom = () => {
		return index === 0;
	}
	const top = () => {
		return index === intervals.length - 1;
	}
	const down = () => {
		if ( index === 0) return false;
		else {
			index -= 1;
			return true;
		}
	}
	const up = () => {
		if (index === intervals.length - 1) return false;
		else {
			index += 1;
			return true;
		}
	}
	
	const getValue = () => {
		return intervals[index];
	}
	return {
		intervals,
		bottom,
		top,
		down,
		up,
		getValue,
	} as TimerIntervals;	
}

export type CSPControlProps = {
	failOrDone: boolean,
	playState: boolean,
	setPlayState: (_: boolean) => void,
	time: number,
	setTime: (_: number) => void,
}
function CSPControls({failOrDone, playState, setPlayState, time, setTime}: CSPControlProps) {
	const [timerInt, setTimerInt] = React.useState(createTimerInterval(1000/60, 1000, 1000/20));
	
	function slower() {
		timerInt.up();
		setTime(timerInt.getValue());
		setTimerInt({...timerInt});
	}
	
	function faster() {
		timerInt.down();
		setTime(timerInt.getValue());
		setTimerInt({...timerInt});
	}
	
	function togglePlay() {
		setPlayState(!playState);	
	}
	return (
		<div className={styles.cspControlsContainer}>
			<button onClick={slower} disabled={timerInt.top() || failOrDone} className={styles.cspControlsBtn}>{'<<'}</button>
			<button onClick={togglePlay} disabled={failOrDone} className={styles.cspControlsBtn}>{playState ? '||' : '>'}</button>
			<button onClick={faster} disabled={timerInt.bottom() || failOrDone} className={styles.cspControlsBtn}>{'>>'}</button>
		</div>
	)
}

export default CSPControls;