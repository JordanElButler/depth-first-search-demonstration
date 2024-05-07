// generate tilings for dom-trionimoes
'use strict';

const tiles = [
  {
    name: 'v2',
    anchor: [ 0, 0 ],
    pattern: [
      [ 1 ],
      [ 1 ],
    ]
  },
  {
    name: 'h2',
    anchor: [ 0, 0 ],
    pattern: [ [ 1, 1 ] ]
  },
  {
    name: 'v3',
    anchor: [ 1, 0 ],
    pattern: [
      [ 1 ],
      [ 1 ],
      [ 1 ],
    ]
  },
  {
    name: 'h3',
    anchor: [ 0, 1 ],
    pattern: [ [ 1, 1, 1 ] ]
  },
  {
    name: 'l0',
    anchor: [ 1, 0 ],
    pattern: [
      [ 1, 0 ],
      [ 1, 1 ],
    ]
  },
  {
    name: 'l1',
    anchor: [ 0, 0 ],
    pattern: [
      [ 1, 1 ],
      [ 1, 0 ],
    ]
  },
  {
    name: 'l2',
    anchor: [ 0, 1 ],
    pattern: [
      [ 1, 1 ],
      [ 0, 1 ],
    ]
  },
  {
    name: 'l3',
    anchor: [ 1, 1 ],
    pattern: [
      [ 0, 1 ],
      [ 1, 1 ],
    ]
  }
];

const tileAnchors = [];
for ( let t = 0; t < tiles.length; t++ ) {
  const tile = tiles[ t ];
  for ( let i = 0; i < tile.pattern.length; i++ ) {
    for ( let j = 0; j < tile.pattern[ i ].length; j++ ) {
      if ( tile.pattern[ i ][ j ] === 0 ) continue;
      tileAnchors.push( [ t, i, j ] );
    }
  }
}

const gm = 20;
const gn = 20;

const randomArray = ( n ) => {
  const arr = [];
  for ( let i = 0; i < n; i++ ) arr.push( i );
  for ( let i = 0; i < n; i++ ) {
    const j = Math.floor( Math.random() * ( n - i ) ) + i;
    const tmp = arr[ j ];
    arr[ j ] = arr[ i ];
    arr[ i ] = tmp;
  }
  return arr;
}

const deepArrayCopy = (arr) => {
  if (arr.constructor === Array) {
    return arr.map(n => deepArrayCopy(n))
  }
  return arr;
}

const randomColor = () => {
  const r = Math.floor( Math.random() * 256 );
  const g = Math.floor( Math.random() * 256 );
  const b = Math.floor( Math.random() * 256 );

  return `rgb(${ r },${ g },${ b })`
}

function tileGenerator ( m, n ) {

  const initialArr = []
  for ( let i = 0; i < m; i++ ) {
    const tmp = []
    for ( let j = 0; j < n; j++ ) {
      tmp.push( -1 );
    }
    initialArr.push( tmp );
  }

  const stack = [];
  const ra = randomArray( tiles.length );
  stack.push( { arr: initialArr, ra: randomArray( tileAnchors.length ), ti: 0 } )


  const step = ( state ) => {

    let { stack } = state;

    const tileIndex = stack.length;
    if ( tileIndex == 0 ) throw new Error( "Cannot generate a tiling" );

    const { arr, ra, ti } = stack[stack.length - 1];

    let emptySpot = null;
    let found = false;
    for ( let i = 0; i < arr.length && !found; i++ ) {
      for ( let j = 0; j < arr[ i ].length && !found; j++ ) {
        if ( arr[ i ][ j ] === -1 ) {
          emptySpot = [ i, j ];
          found = true;
        }
      }
    }
    for (let tt = ti; tt < ra.length; tt++ ) {

      const [ t, ay, ax ] = tileAnchors[ ra[ tt ] ];

      const tileChoice = tiles[ t ];
      const [ y, x ] = emptySpot;

      const { name, pattern, anchor } = tileChoice;
      let errorFlag = false;

      for ( let i = 0; i < pattern.length && !errorFlag; i++ ) {
        for ( let j = 0; j < pattern[ i ].length && !errorFlag; j++ ) {
          if ( pattern[ i ][ j ] === 0 ) continue;
          const cx = x - ax + j;
          const cy = y - ay + i;
          // check if tile placement is out of bounds
          if ( cx < 0 || cy < 0 || cx >= n || cy >= m ) {
            errorFlag = true;
            continue;
          }
          // check if tile overwrites
          if ( arr[ cy ][ cx ] !== -1 ) {
            errorFlag = true;
            continue;
          }
        }
      }
      // write to arr
      const newArr = deepArrayCopy( arr );
      if ( !errorFlag ) {
        for ( let i = 0; i < pattern.length; i++ ) {
          for ( let j = 0; j < pattern[ i ].length; j++ ) {
            if ( pattern[ i ][ j ] === 0 ) continue;
            const cx = x - ax + j;
            const cy = y - ay + i;
            newArr[ cy ][ cx ] = tileIndex;
          }
        }

        stack[stack.length-1].ti = tt + 1;
        stack.push( { arr: newArr, ra: randomArray( tileAnchors.length ), ti: 0 } )
        return {
          stack,
        };
      }
    }
    stack.pop();
    return {
      stack,
    }
  }

  const done = ( state ) => {
    const { stack } = state;
    const { arr } = stack[stack.length - 1];
    for ( let i = 0; i < m; i++ ) {
      for ( let j = 0; j < n; j++ ) {
        if ( arr[ i ][ j ] === -1 ) return false;
      }
    }
    return true;
  }


  const failed = ( state ) => {
    return state.stack.length === 0;
  }

  return {
    state: { stack },
    step,
    done,
    failed,
  }
}

let tg = tileGenerator( gm, gn );
let steps = 0;
let message =``;
const performStep = () => {
  let { state, done, step, failed } = tg;
  if (failed(state)) {
     message = `failed at ${steps}`;
     console.log(message);
  }
  else if ( done( state ) ) {
    message = `done at ${steps}`;
    showTiling();
  } else {
    message = `steps ${steps} ${state.stack.length}`;
    showTiling();
    state = step( state );
    steps += 1;
  }
}

const intervalId = window.setInterval( () => {
  performStep();
}, 1000/60 )

document.getElementById( 'btn' ).addEventListener( 'click', () => {
  tg = tileGenerator( gm, gn );
} );

const colorList = new Array( gm * gn / 2 ).fill( -1 ).map( _ => randomColor() );

function showTiling () {
  const { state } = tg;
  const { stack } = state;
  const { arr } = stack[ stack.length - 1 ];
  const tileContainer = document.getElementById( 'display-container' )
  const nodes = [];
  for ( let i = 0; i < arr.length; i++ ) {
    const div = document.createElement( 'div' );
    div.classList.add( 'row-container' );
    const rowNodes = [];
    for ( let j = 0; j < arr[ i ].length; j++ ) {
      const val = arr[ i ][ j ];
      const newDiv = document.createElement( 'div' );
      newDiv.textContent = val === -1 ? '' : val;
      newDiv.classList.add( 'square' );
      if ( val !== -1 ) newDiv.style.backgroundColor = colorList[ val ];
      rowNodes.push( newDiv );
    }
    div.replaceChildren( ...rowNodes );
    nodes.push( div );
  }
  const m = document.getElementById('message');
  m.textContent = message;
  tileContainer.replaceChildren( ...nodes );
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