import React, { Component } from 'react'

class BlockChainItem extends Component {
    getStyle = () => {
        return {
            background: "#f4f4f4",
            padding: "10px",
            borderBotoom: "1px #ccc dotted",
        };
    };

    render() {
        console.log(this.props.item)
        const { index, timestamp, proof, transaction, previous_hash } = this.props.item;
        return (
            <div style={this.getStyle()}>
                index: {index} <br />
                hash: {previous_hash} <br />
                transaction: {transaction} <br />
                proof: {proof} <br />
                timestamp: {timestamp} <br />
            </div>
        )
    }
}

export default BlockChainItem