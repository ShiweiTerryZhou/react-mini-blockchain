import React, { Component } from "react";
import { Button, Card, Form, ListGroup } from "react-bootstrap";

class BlockChainItem extends Component {
  constructor(props) {
    super(props);
    const {
      index,
      timestamp,
      proof,
      transaction,
      previous_hash,
    } = this.props.item;
    this.state = {
      cardBackground: [144, 230, 144],
      hash: previous_hash,
      proof: proof,
      timestamp: timestamp,
      transaction: transaction,
      index: index,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, flag) {
    let {
      index,
      timestamp,
      proof,
      transaction,
      previous_hash,
    } = this.props.item;
    switch (flag) {
      case 0:
        let new_transaction = e.target.value;
        this.setState((state) => {
          state.transaction = new_transaction;
        });
        this.props.updateVerification(index, new_transaction, proof, timestamp);
        break;
      case 1:
        let new_proof = e.target.value;
        this.setState((state) => {
          state.transaction = new_proof;
        });
        this.props.updateVerification(index, transaction, new_proof, timestamp);
        break;
      case 2:
        let new_timestamp = e.target.value;
        this.setState((state) => {
          state.transaction = new_timestamp;
        });
        this.props.updateVerification(index, transaction, proof, new_timestamp);
        break;
      default:
        break;
    }
  }

  componentWillReceiveProps(props) {
    this.setState((state) => {
      state.hash = this.props.item.previous_hash;
    });
    if (this.props.item.verified === 1) {
      this.setState((state) => {
        state.cardBackground = [144, 230, 144];
      });
    } else if (this.props.item.verified === 0) {
      this.setState((state) => {
        state.cardBackground = [255, 255, 153];
      });
    } else if (this.props.item.verified === -1) {
      this.setState((state) => {
        state.cardBackground = [255, 204, 203];
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState((state) => {
        state.hash = this.props.item.previous_hash;
      });
    }
  }

  render() {
    console.log(this.state);
    const {
      index,
      timestamp,
      proof,
      transaction,
      previous_hash,
    } = this.props.item;
    return (
      <div>
        {/* index: {index} <br />
                hash: {previous_hash} <br />
                transaction: {transaction} <br />
                proof: {proof} <br />
                timestamp: {timestamp} <br /> */}
        <Card
          style={{
            width: "18rem",
            background: "rgb(" + this.state.cardBackground + ")",
            marginLeft: "50px",
            marginBottom: "50px",
          }}
        >
          <Card.Body>
            <Card.Title>Block Index: {index}</Card.Title>
            <Card.Text>
              <Form.Group>
                transaction:{" "}
                <Form.Control
                  size="sm"
                  type="text"
                  defaultValue={transaction}
                  placeholder="transaction"
                  onInput={(e) => this.handleChange(e, 0)}
                />
                proof:{" "}
                <Form.Control
                  size="sm"
                  type="number"
                  value={proof}
                  placeholder="proof"
                  onInput={(e) => this.handleChange(e, 1)}
                  readOnly
                />
                timestamp:{" "}
                <Form.Control
                  size="sm"
                  type="text"
                  defaultValue={timestamp}
                  placeholder="timestamp"
                  onInput={(e) => this.handleChange(e, 2)}
                  readOnly
                />
                original hash:{" "}
                <Form.Control
                  size="sm"
                  type="text"
                  defaultValue={this.state.hash}
                  placeholder="hash"
                  readOnly
                />
                current hash:{" "}
                <ListGroup>
                  <ListGroup.Item>{this.state.hash}</ListGroup.Item>
                </ListGroup>
              </Form.Group>
            </Card.Text>
            <Button
              variant="primary"
              onClick={() =>
                this.props.reVerification(
                  this.state.index,
                  this.state.transaction,
                  this.state.timestamp
                )
              }
            >
              Re-Hash This Block
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default BlockChainItem;
