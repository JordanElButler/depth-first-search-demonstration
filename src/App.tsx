import React from 'react';
import SudokuView from './components/SudokuView';
import TileView from './components/TileView';
import styles from './App.module.css';

function App() {
	const components = [TileView, SudokuView];
	const [compIndex, setCompIndex] = React.useState(0);
	const myRef = React.useRef<HTMLDivElement>(null);
	const [btnEnabled, setBtnEnabled] = React.useState(true);

	function onClick() {
		const el = myRef.current;
		if (el) {
			el.classList.add(styles.driftAway);
			setBtnEnabled(false);
		}
		setTimeout(() => {
			setCompIndex((compIndex + 1) % components.length);
			setBtnEnabled(true);
		}, 1000/4);
	}
	
	return (
		<div className={styles.appContainer}>
			<button className={styles.mBtn} disabled={!btnEnabled} onClick={onClick}>{'next app'}</button>
			{compIndex === 0 && <TileView refTarget={myRef} />}
			{compIndex === 1 && <SudokuView refTarget={myRef} />}
		</div>
	);
}

export default App;