import React from 'react';

export default class GameHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='game-header'>
                <h1 className='title'>2048</h1>
                <div className='scores-container'>
                    <div className='curr-score'>
                        <div className='score-header'>Score</div>
                        {this.props.score}
                    </div>
                    <div className='best-score'>
                        {this.props.best}
                        <div className='score-header'>Best</div>
                    </div>
                </div>
                <div className='empty-block'></div>
            </div>
        )
    }

}