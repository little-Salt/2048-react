import React from 'react';
import GameTileCell from './gameTileCell';

export default class GameTile extends React.Component {
    constructor(props) {
        super(props);
    }

    generateTiles(grid) {

        function generateTileCellKey (pos)  {
            return 'tile-position-'+pos.row+'-'+pos.col;
        }

        function generateTileCellClass (pos, val, stat)  {
            return 'tile ' +'tile-' + ((val > 2048)? 'super':val) + ' ' + generateTileCellKey(pos) + ' ' + 'tile-'+stat;
        }

        const tiles = [];

        grid.forEach(row => {
            row.filter(e => e !== null).forEach(cell => {
                tiles.push((<GameTileCell key={generateTileCellKey(cell.pos)} className={generateTileCellClass(cell.pos, cell.val, cell.stat)} val={cell.val}/>));
            });
        })

        return tiles;
    }

    render() {
        return (
            <div className='game-tiles'>
                {this.generateTiles(this.props.grid)}
            </div>
        );
    }
}