import React from 'react';
import GameGridRow from './gameGridRow';

export default class GameGrid extends React.Component {
    constructor(props) {
        super(props);
    }

    generateGrid(size) {
        return Array(size).fill(0).map((e, i) => <GameGridRow key={i} size={size} />);
    }

    render() {
        return (
            <div className='game-grid'>
                {this.generateGrid(this.props.size)}
            </div>
        );
    }
}