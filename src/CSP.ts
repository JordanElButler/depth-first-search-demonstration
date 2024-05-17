// constraint satisfaction problem

// need a type
// need a way to generate choices from a state
// need a way to check choice satisfies constraints
import { deepCopy, randomArray, sequence } from './utils';


export type CSPData = {
	depth: number
}
export type CSPOptions = {
	randomized: boolean,
}

export type CSP<T,C,E> = {
	done: () => boolean,
	fail: () => boolean,
	step: () => void,
	getState: () => T,
	getSteps: () => number,
}
export function createCSP<T, C, E> ( initialState: T, getChoices: (arg0: T) => C[], compose: (arg0: T, arg1: C, arg2: CSPData) => T, constraintSatisfied: ( arg0: T, arg1: C ) => boolean, outerDone: (arg0: T) => boolean, options: CSPOptions ) {

	const { randomized } = options;

	const _state = deepCopy(initialState);
	const _choices = getChoices(initialState);
	let _ai;
	if (randomized) _ai = randomArray(_choices.length);
	else _ai = sequence(_choices.length);
	
	const stack = [
		{ state: _state, choices: _choices, ai: _ai, ti: 0 }
	];
	
	let steps = 0;
	
	function done() {
		if (stack.length === 0) return false;
		const state = stack[stack.length -1].state;
		return outerDone(state);
	}
	function fail() {
		return stack.length === 0;
	}
	

	function getSteps() {
		return steps;
	}
	
	function step() {
		if (done()) {
			console.log('done but stepping');
			return;
		} else if (fail()) {
			console.log('failed but stepping');
			return;
		}
		
		const { state, choices, ai, ti } = stack[stack.length - 1];
		steps += 1;
		
		for (let tt = ti; tt < ai.length; tt++) {
			let satisfied = false;
			const choice = choices[ai[tt]];
			
			if (constraintSatisfied(deepCopy(state), choice)) {
				stack[stack.length-1].ti = tt + 1;
				const newState: T = compose(deepCopy(state), choice, { depth: stack.length } as CSPData);
				const newChoices = getChoices(newState);
				stack.push({
					state: newState,
					choices: newChoices,
					ai: randomized ? randomArray(newChoices.length) : sequence(newChoices.length),
					ti: 0,
				});
				return;
			}
		}
		stack.pop();
		return;
	}
	
	function getState(): T {
		if (stack.length === 0) return initialState;
		else return stack[stack.length - 1].state;
	}
	return {
		done,
		fail,
		step,
		getSteps,
		getState,
	}

}