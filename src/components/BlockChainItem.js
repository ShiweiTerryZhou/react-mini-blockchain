import React, { Component } from 'react'
import { Button, Card, Form } from 'react-bootstrap';

class BlockChainItem extends Component {
    constructor(props) {
        super(props)
        this.state = { cardBackground: [144, 230, 144] }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e) {
        // this.setState(state => {
        //     state.cardBackground = [255, 255, 153]
        // });
        this.props.setVerification(this.props.item.index, 0)
    }

    componentWillReceiveProps(props) {
        if (this.props.item.verified === 1) {
            this.setState(state => {
                state.cardBackground = [144, 230, 144]
            });
        }
        else if (this.props.item.verified === 0) {
            this.setState(state => {
                state.cardBackground = [255, 255, 153]
            });
        }
        else if (this.props.item.verified === -1) {
            this.setState(state => {
                state.cardBackground = [255, 204, 203]
            });
        }
    }

    render() {
        console.log(this.props.item)
        const { index, timestamp, proof, transaction, previous_hash } = this.props.item;
        return (
            <div >
                {/* index: {index} <br />
                hash: {previous_hash} <br />
                transaction: {transaction} <br />
                proof: {proof} <br />
                timestamp: {timestamp} <br /> */}
                <Card style={{ width: '18rem', background: 'rgb(' + this.state.cardBackground + ')' }} >
                    <Card.Body>
                        <Card.Title>Block Index: {index}</Card.Title>
                        <Card.Text>
                            <Form.Group onInput={(e) => this.handleChange(e)} >
                                transaction: <Form.Control size="sm" type="text" defaultValue={transaction} placeholder="transaction" />
                                proof: <Form.Control size="sm" type="number" defaultValue={proof} placeholder="proof" />
                                timestamp: <Form.Control size="sm" type="text" defaultValue={timestamp} placeholder="timestamp" />
                                hash: <Form.Control size="sm" type="text" defaultValue={previous_hash} placeholder="hash" />
                            </Form.Group>
                        </Card.Text>
                        <Button variant="primary" style={{ marginBottom: '5%' }}>Verify This Block</Button>
                        <Button variant="primary">Re-Hash This Block</Button>
                    </Card.Body>
                </Card>
            </div>

        )
    }
}

export default BlockChainItem