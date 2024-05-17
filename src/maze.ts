import {CSP, CSPOptions, createCSP} from './CSP';
import { deepCopy } from './utils';


export enum MazeEnum {
	entrance = 'entrance',
	exit = 'exit',
	empty = 'empty',
	wall = 'wall',
	body = 'body',
	head = 'head',
	visited = 'visited',
}
export type Maze = MazeEnum[][];
export type MazeChoice = {
	x: number,
	y: number,
}
const findHead = (maze: Maze): number[] => {
	let entrance = [-1, -1];
	for (let i = 0; i < maze.length; i++) {
		for (let j = 0; j < maze[i].length; j++) {
			if (maze[i][j] === MazeEnum.head) return [i, j];
			else if (maze[i][j] === MazeEnum.entrance) entrance = [i, j];
		}
	}
	return entrance;
}
const checkValidSearch = (maze: Maze, x: number, y: number): MazeChoice | null => {
	if (y < 0 || y >= maze.length) return null;
	if (x < 0 || x >= maze[y].length) return null;
	if (maze[y][x] !== MazeEnum.empty) return null;
	return { x, y} as MazeChoice;
}
const getMazeChoices = (maze: Maze): MazeChoice[] => {
	const [y, x] = findHead(maze);
	const choices = [];
	// north,
	const n = checkValidSearch(maze, x, y - 1);
	if (n) choices.push(n);
	//east,
	const e = checkValidSearch(maze, x + 1, y);
	if (e) choices.push(e);
	//south,
	const s = checkValidSearch(maze, x, y + 1);
	if (s) choices.push(s);
	//west,
	const w = checkValidSearch(maze, x - 1, y);
	if (w) choices.push(w);

	return choices;
}
const mazeCompose = (maze: Maze, choice: MazeChoice): Maze => {
	const { x, y } = choice;
	const [hi, hj] = findHead(maze);
	if (maze[hi][hj] === MazeEnum.entrance) {
		maze[y][x] = MazeEnum.head;
	} else {
		maze[hi][hj] = MazeEnum.body;
		maze[y][x] = MazeEnum.head;
	}
	return maze;
}

const mazeConstraintSatisfaction = (maze: Maze, choice: MazeChoice): boolean => {
	const { x, y } = choice;
	return maze[y][x] === MazeEnum.empty;
}

const mazeDone = (maze: Maze): boolean => {
	const [y, x] = findHead(maze);
	// check neighbors empty
	if (maze[y-1] && maze[y-1][x] === MazeEnum.exit ||
	    maze[y] && maze[y][x+1] === MazeEnum.exit ||
		maze[y+1] && maze[y+1][x] === MazeEnum.exit ||
		maze[y] && maze[y][x-1] === MazeEnum.exit) {
			return true;
		}
	return false;
}
export function mazeSolver(maze: Maze) {

	const options = { randomized: false } as CSPOptions;
	const csp = createCSP(
		maze,
		getMazeChoices,
		mazeCompose,
		mazeConstraintSatisfaction,
		mazeDone,
		options
	);
	return csp;
}

const oldPattern = 
`
WWWWWWWWWWWWWWW
WEOOOOOOOOOOOOO
WOWWWWWWWOOOOWW
WOOOOOOWWWWWOXW
WWWWWWOOOWWWWWW
`


const newPattern = 
`
WWWWWWWWWWWWWWWWWWWWWW
WEOOOOOOOOOOOOOOOOOOOW
WOWWWWWWWWWWWWWWWWWWOW
WOWOOOOOOOOOOOOOOOOOOW
WOWOWWWWWWWWWWWWWWWWOW
WOWOOOOOOOOOOOOOOOOWOW
WOWWWWWWWWWWWWWWWWWWWW
WOOOOOOOOOOOOOOOOOOOXW
WWWWWWWWWWWWWWWWWWWWWW
`;
const pattern = newPattern;

const mazeTemplate = [];
let lines = pattern.split('\n');
for (let i = 0; i < lines.length; i++) {
	console.log(lines[i]);
	const row = [];
	const s = lines[i];
	for (let j = 0; j < lines[i].length; j++) {
		if (lines[i][j] === 'W') row.push(MazeEnum.wall);
		else if (lines[i][j] === 'O') row.push(MazeEnum.empty);
		else if (lines[i][j] === 'E') row.push(MazeEnum.entrance);
		else if (lines[i][j] === 'X') row.push(MazeEnum.exit);
	}
	if (row) mazeTemplate.push(row);
}
export const initialMaze = deepCopy(mazeTemplate);
