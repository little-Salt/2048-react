import React from 'react';

export default class GameTileCell extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.className}>
                <div className='tile-inner'>
                    {this.props.val}
                </div>
            </div>);
    }
}