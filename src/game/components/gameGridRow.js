import React from 'react';
import GameGridCell from './gameGridCell';

export default class GameGridRow extends React.Component {
    constructor(props) {
        super(props);
    }

    generateRow(size) {
        return Array(size).fill(0).map((e, i) => <GameGridCell key={i} size={size} />);
    }

    render() {
        return (
            <div className='game-grid-row'>
                {this.generateRow(this.props.size)}
                <div className='empty-block' />
            </div>
        );
    }

}