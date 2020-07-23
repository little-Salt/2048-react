import React from 'react';
import GameGrid from './gameGrid';
import GameTile from './gameTile';

export default class GameBoard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='game-board'>
                {this.props.over && <div className='game-message'><p>game over!</p></div>}
                <GameGrid size={this.props.size}/>
                <GameTile grid={this.props.grid} />
            </div>
        );
    }

}