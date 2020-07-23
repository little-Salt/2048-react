import React from 'react';
import './game.css';
import GameManager, { DIRECTION } from '../GameManager';
import GameHeader from './gameHeader';
import GameOptionBar from './gameOptionBar';
import GameBoard from './gameBoard';


const gameManager = new GameManager();

export default class GameView extends React.Component {
    constructor(props) {
        super(props);
        this.grid_size = gameManager.gridSize;
        this.state = gameManager.getCurrentState();
        this.resetGameHandler = this.resetGameHandler.bind(this);
        this.keyPressHandler = this.keyPressHandler.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keydown', this.keyPressHandler);  
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.keyPressHandler);
    }

    resetGameHandler() {
        gameManager.resetGame();
        this.setState(gameManager.getCurrentState());
    }

    keyPressHandler(event) {
        let stateChange = false;
        switch(event.key) {
            case 'ArrowUp':
                stateChange = gameManager.updateGameWithMovement(DIRECTION.UP);
                break;
            case 'ArrowDown':
                stateChange = gameManager.updateGameWithMovement(DIRECTION.DOWN);
                break;
            case 'ArrowLeft':
                stateChange = gameManager.updateGameWithMovement(DIRECTION.LEFT);
                break;
            case 'ArrowRight':
                stateChange = gameManager.updateGameWithMovement(DIRECTION.RIGHT);
                break;
        }
        if (stateChange) {
            this.setState(gameManager.getCurrentState());
        }
    }

    movementHandler(event) {
        console.log('enter press here! ');
    }

    render() {
        return (
            <div className='game-container'>
                <GameHeader score={this.state.score} best={this.state.best}/>
                <GameOptionBar resetGameHandler={this.resetGameHandler}/>
                <GameBoard size={this.grid_size} grid={this.state.grid} over={this.state.over} />
            </div>
        )
    }

}