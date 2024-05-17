export const randomArray = ( n: number ): number[] => {
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

export const sequence = (n: number) => {
	const arr: number[] = [];
	for (let i = 0; i < n; i++) arr.push(i);
	return arr;
}

export function deepCopy<T> ( value: T ): T {
	if ( value === null || typeof value !== 'object' || 'function' === typeof value ) {
		return value;
	}

	if ( Array.isArray( value ) ) {
		return ( value as any ).map( deepCopy ) as T; // Cast to any for array methods
	}

	const copy: any = {};
	for ( const key of Object.keys( value ) ) {
		copy[ key ] = deepCopy( value[ key ] );
	}
	return copy as T;
}

export function randomColor(): string {
	const r = Math.floor(Math.random()*256);
	const g = Math.floor(Math.random()*256);
	const b = Math.floor(Math.random()*256);
	return `rgb(${r},${g},${b})`;
}

function cubeRoot(x: number): number {
	const eps = 0.0001;
	let guess = 1;
	while (true) {
		const g3 = guess * guess * guess;
		if (Math.abs(g3 - x) <= eps) return guess;
		guess = 1 / 3 * (2 * guess  + x / (guess * guess));
	}
}

/*
// using poisson disc sampling
export function randomColors(n: number): string[] {
	
	function toColor(rf: number, gg: number, bb: number): string {
		const r = Math.floor(rr * 256);
		const g = Math.floor(gg * 256);
		const b = Math.floor(bb * 256);
		return `rgb(${r}, ${g}, ${b})`;
	}
	const k = 30;
	const ans: string[] = [];
	let n3 = cubeRoot(n * 2);
	
	let r = 1 / n3;
	
	const cells = [[[]]];
	for (let i = 0; i < n3; i++) {
		for (let j = 0; j < n3; j++) {
			for (let k = 0; k < n3; k++) {
					
			}
		}
	}
	
	
}
*/