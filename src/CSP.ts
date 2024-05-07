// constraint satisfaction problem

// need a type
// need a way to generate choices from a state
// need a way to check choice satisfies constraints
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

const sequence = (n: number) => {
	const arr: number[] = [];
	for (let i = 0; i < n; i++) arr.push(i);
	return arr;
}

function deepCopy<T> ( value: T ): T {
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

export type CSPOptions = {
	randomized: boolean,
}

export function CSP<T, C, E> ( initialState: T, choices: C[], compose: (arg0: T, arg1: C) => T, constraintSatisfied: ( arg0: T, arg1: C ) => boolean, done: (arg0: T) => boolean, options: CSPOptions ) {

	const { randomized } = options;

	let ai;
	if (randomized) ai = randomArray(choices.length);
	else ai = sequence(choices.length);
	
	const stack = [
		{ state: deepCopy(initialState), ai, ti: 0 }
	];
	
	let steps = 0;
	
	function fail() {
		return stack.length === 0;
	}
	

	function getSteps() {
		return steps;
	}
	
	function step() {
		if (stack.length === 0) return;
		
		const { state, ai, ti } = stack[stack.length - 1];
		steps += 1;
		
		for (let tt = ti; tt < ai.length; tt++) {
			let satisfied = false;
			const choice = choices[ai[tt]];
			
			if (constraintSatisfied(deepCopy(state), choice)) {
				stack[stack.length-1].ti = tt + 1;
				const newState: T = compose(deepCopy(state), choice);
				stack.push({
					state: newState,
					ai: randomized ? randomArray(choices.length) : sequence(choices.length),
					ti: 0,
				});
				return;
			}
		}
		stack.pop();
		return;
	}
	return {
		done,
		fail,
		step,
		getSteps,
	}

}