import { CSPData, CSP, CSPOptions } from './CSP';
import { createCSP } from './CSP';
import { deepCopy } from './utils';

export const tiles = [
  {
    name: 'sv',
    pattern: [
      [ 1, 0 ],
      [ 1, 1 ],
      [ 0, 1 ],
    ]
  },
  {
    name: 'sh',
    pattern: [
      [0, 1, 1],
      [1, 1, 0],
    ]
  },
  {
    name: 'zv',
    pattern: [
      [0, 1],
      [1, 1],
      [1, 0],
    ]
  },
  {
    name: 'zh',
    pattern: [
      [1, 1, 0],
      [0, 1, 1],
    ]
  },
  {
    name: 'sq',
    pattern: [
      [1, 1],
      [1, 1],
    ]
  },
  {
    name: 'rl0',
    pattern: [
      [1, 0],
      [1, 0],
      [1, 1],
    ]
  },
  {
    name: 'rl1',
    pattern: [
      [1, 1, 1],
      [1, 0, 0],
    ]
  },
  {
    name: 'rl2',
    pattern: [
      [1, 1],
      [0, 1],
      [0, 1],
    ]
  },
  {
    name: 'rl3',
    pattern: [
      [0, 0, 1],
      [1, 1, 1],
    ]
  },
  {
    name: 'll0',
    pattern: [
      [0, 1],
      [0, 1],
      [1, 1]
    ]
  },
  {
    name: 'll1',
    pattern: [
      [1, 0, 0],
      [1, 1, 1],
    ]
  },
  {
    name: 'll2',
    pattern: [
      [1, 1],
      [1, 0],
      [1, 0],
    ]
  },
  {
    name: 'll3',
    pattern: [
      [1, 1, 1],
      [0, 0, 1],
    ]
  },
  {
    name: 'ih',
    pattern: [ [ 1, 1, 1, 1 ] ]
  },
  {
    name: 'iv',
    pattern: [
      [ 1 ],
      [ 1 ],
      [ 1 ],
      [ 1 ],
    ]
  },
];

const colors = new Map<string, string>([
  
  ['sh', 'rgb(0, 200, 200)'],
  ['sv', 'rgb(0, 200, 200)'],
  
  ['zh', 'rgb(200, 200, 0)'],
  ['zv', 'rgb(200, 200, 0)'],
  
  ['sq', 'rgb(200, 0, 200)'],
  
  ['rl0', 'rgb(0, 255, 0)'],
  ['rl1', 'rgb(0, 255, 0)'],
  ['rl2', 'rgb(0, 255, 0)'],
  ['rl3', 'rgb(0, 255, 0)'],
  
  ['ll0', 'rgb(255, 0, 0)'],
  ['ll1', 'rgb(255, 0, 0)'],
  ['ll2', 'rgb(255, 0, 0)'],
  ['ll3', 'rgb(255, 0, 0)'],
  
  ['ih', 'rgb(0, 0, 0)'],
  ['iv', 'rgb(0, 0, 0)'],
]);
export function getTileColor(choice: TileChoice): string {
  const { tileIndex } = choice;
  const { name } = tiles[tileIndex];
  
  return colors.get(name)!;
}

const gm = 20;
const gn = 10;
export const TileEmpty = -1;

export type BoardCell = {
  index: number,
  choice: TileChoice | null,
}
export type TileBoard = {
  w: number,
  h: number,
  board: BoardCell[][]
}
export type TileChoice = {
  tileIndex: number,
  anchorX: number,
  anchorY: number
}
export const tileChoices: TileChoice[] = [];
for ( let t = 0; t < tiles.length; t++ ) {
  const tile = tiles[ t ];
  for ( let i = 0; i < tile.pattern.length; i++ ) {
    for ( let j = 0; j < tile.pattern[ i ].length; j++ ) {
      if ( tile.pattern[ i ][ j ] === 0 ) continue;
      tileChoices.push( {
        tileIndex: t,
        anchorX: j,
        anchorY: i,
      } );
    }
  }
}

const findEmptySpot = ( tileBoard: TileBoard ): [ number, number ] | null => {
  const { w, h, board } = tileBoard;
  for ( let i = 0; i < h; i++ ) {
    for ( let j = 0; j < w; j++ ) {
      if ( board[ i ][ j ].index === TileEmpty ) return [ i, j ];
    }
  }
  return null;
}
const getTileChoices = (tileBoard: TileBoard): TileChoice[] => {
  return tileChoices;
}
const tileCompose = ( tileBoard: TileBoard, choice: TileChoice, cspData: CSPData ): TileBoard => {
  const emptySpot = findEmptySpot( tileBoard );
  if ( !emptySpot ) throw new Error( "error calling compose on tiles" );
  const [ y, x ] = emptySpot;
  const { tileIndex, anchorX, anchorY } = choice;
  const tile = tiles[ tileIndex ];
  const { pattern } = tile;
  for ( let i = 0; i < pattern.length; i++ ) {
    for ( let j = 0; j < pattern[ i ].length; j++ ) {
      if ( pattern[ i ][ j ] === 0 ) continue;
      const cx = x - anchorX + j;
      const cy = y - anchorY + i;
      tileBoard.board[ cy ][ cx ] = {
        index: cspData.depth,
        choice: deepCopy(choice),
      }
    }
  }
  return tileBoard;
}
const tileConstraintSatisfied = ( tileBoard: TileBoard, tileChoice: TileChoice ): boolean => {
  const emptySpot = findEmptySpot(tileBoard);
  if (!emptySpot) throw new Error("cannot find empty spot in tile constraint satisfaction function");
  const [ y, x] = emptySpot;
  const { tileIndex, anchorX, anchorY } = tileChoice;
  const tile = tiles[ tileIndex ];
  const { pattern } = tile;

  for ( let i = 0; i < pattern.length; i++ ) {
    for ( let j = 0; j < pattern[ i ].length; j++ ) {
      if ( pattern[ i ][ j ] === 0 ) continue;
      const cx = x - anchorX + j;
      const cy = y - anchorY + i;
      // check if tile placement is out of bounds
      if ( cx < 0 || cy < 0 || cx >= tileBoard.w || cy >= tileBoard.h ) {
        return false;
      }
      // check if tile overwrites
      if ( tileBoard.board[ cy ][ cx ].index !== TileEmpty ) {
        return false;
      }
    }
  }
  return true;
}
const tileDone = ( tileBoard: TileBoard ): boolean => {
  return !findEmptySpot( tileBoard );
}
export function tileSolver ( tileBoard: TileBoard ): CSP<TileBoard, TileChoice, Error> {
  const options: CSPOptions = {
    randomized: true,
  } as CSPOptions;
  const csp = createCSP(
    tileBoard,
    getTileChoices,
    tileCompose,
    tileConstraintSatisfied,
    tileDone,
    options,
  );
  return csp;
}

const initialArr = [];
for ( let i = 0; i < gm; i++ ) {
  const tmp = []
  for ( let j = 0; j < gn; j++ ) {
    tmp.push( {
      index: -1,
      choice: null,
     } as BoardCell );
  }
  initialArr.push( tmp );
}
export const initialBoard: TileBoard = {
  w: gn,
  h: gm,
  board: initialArr,
}





/*
// represent edge as pair [[],[]]
function tileGenerator2 ( m, n ) {

  // state needs an array of edges
  let state = {
    edgeArray: [],
    stack: [ { ra: randomArray( numEdges ), ti: 0 } ],
  }

  // number of edges == m * (n-1) + n * (m - 1);
  const numEdges = m * ( n - 1 ) + n * ( m - 1 );

  const edges = [];
  for ( let i = 0; i < m; i++ ) {
    for ( let j = 0; j < n; j++ ) {
      const side = [ i, j ];
      const right = [ [ i, j ], [ i, j + 1 ] ];
      const down = [ [ i, j ], [ i + 1, j ] ];

      if ( i < m - 1 ) edges.push( down );
      if ( j < n - 1 ) edges.push( right );
    }
  }

  function step ( state ) {
    const { edgeArray, stack } = state;

    let { ra, ti } = stack.pop();

    for ( ; ti < ra.length; i++ ) {
      const edgeIn = edges[ ra[ ti ] ];
      const [f, s] = edgeIn;
      // check flood fill area ggreater than 1
      let valid = true;
      //check f
      {
       const [y, x] = f;
       const neighbors = []
       const up = [y - 1, x];
       const down = [y + 1, x];
       const left = [y, x - 1];
       const right = [y, x + 1];
      }
      // check s
      {
        
      }
      if ( valid ) {
        stack.push( { ra, ti: ti + 1 } );
        stack.push( { ra: randomArray( numEdges - edgeArray.length ), ti: 0 } );
        return {
          edgeArray,
          stack,
        }
      }
    }

    return {
      edgeArray,
      stack,
    }
  }

  function done ( state ) {

  }

  return {
    state,
    step,
    done,
  }
}
*/