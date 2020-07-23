import React from 'react';

export default class GameOptionBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='game-options'>
                <button className='game-restart' onClick={this.props.resetGameHandler}>New Game</button>
                <div className='empty-block'></div>
            </div>
        )
    }

}