import React from 'react';
import SudokuView from './components/SudokuView';
import TileView from './components/TileView';
import './App.css';

function App() {
	const components = [TileView, SudokuView];
	const [compIndex, setCompIndex] = React.useState(0);
	const myRef = React.useRef<HTMLDivElement>(null);
	const [btnEnabled, setBtnEnabled] = React.useState(true);
	function onClick() {
		
		const el = myRef.current;
		if (el) {
			el.classList.add('drift-away');
			setBtnEnabled(false);
		}
		setTimeout(() => {
			setCompIndex( (compIndex + 1) % components.length);
			setBtnEnabled(true);
		}, 1000/4);
	}
	
	return (
		<div className={'app-container'}>
			<button className={'m-btn'} disabled={!btnEnabled} onClick={onClick}>{'next app'}</button>
			{compIndex === 0 && <TileView refTarget={myRef} />}
			{compIndex === 1 && <SudokuView refTarget={myRef} />}
		</div>
	);
}
export default App;