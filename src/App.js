import React, { Component } from "react";
import { Nav, Navbar, Button, Form, Modal, Row } from "react-bootstrap";
import "./App.css";
import BlockChainItem from "./components/BlockChainItem";
import "bootstrap/dist/css/bootstrap.min.css";
const crypto = require("crypto");

class App extends Component {
  constructor(props) {
    super(props);
    let today = new Date();
    this.state = {
      currentTransaction: "",
      chain: [
        {
          index: 0,
          timestamp:
            today.getFullYear() +
            "-" +
            (today.getMonth() + 1) +
            "-" +
            today.getDate() +
            " " +
            today.getHours() +
            ":" +
            today.getMinutes() +
            ":" +
            today.getSeconds(),
          proof: 1,
          transaction: "This is genesis block",
          previous_hash: "0",
          verified: 1,
        },
      ],
    };

    this.generateBlocks = this.generateBlocks.bind(this);
    this.handleTransacChange = this.handleTransacChange.bind(this);
    this.setVerification = this.setVerification.bind(this);
    this.updateVerification = this.updateVerification.bind(this);
    this.reVerification = this.reVerification.bind(this);
  }

  /* 
  hashing algorithm:
  SHA256(inverse(previous block hash) + ASCii(index + timestamp + transaction + proof))
  */
  generateBlocks(prev_block, transaction) {
    let prev_data = String(prev_block.previous_hash);
    prev_data = Buffer.from(prev_data, "utf8").toString("hex");

    let today = new Date();
    let time =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate() +
      " " +
      today.getHours() +
      ":" +
      today.getMinutes() +
      ":" +
      today.getSeconds();
    let cur_data =
      String(prev_block.index + 1) + String(time) + String(transaction);
    let cur_proof = 0;
    let cur_hash = "";

    //let pwd = parseInt(prev_data, 16) - parseInt(cur_data_encode, 16)
    //console.log(String(crypto.createHash('sha256').update(pwd).digest('hex')))
    //
    while (cur_hash.substring(0, 2) !== "00") {
      cur_proof = cur_proof + 1;
      let cur_data_try = cur_data + String(cur_proof);
      //make previous has reverse to prevent constant 0s in front
      let pwd = prev_data.split("").reverse().join("") + cur_data_try;
      cur_hash = String(crypto.createHash("sha256").update(pwd).digest("hex"));
    }

    let new_block = {
      index: prev_block.index + 1,
      timestamp: time,
      proof: cur_proof,
      transaction: transaction,
      previous_hash: cur_hash,
      verified: 1,
    };
    this.setState((state) => {
      const chain = state.chain.concat(new_block);
      return {
        chain,
      };
    });
  }

  handleTransacChange(e) {
    this.setState({ currentTransaction: e.target.value });
  }

  setVerification(index, veriStatus) {
    if (veriStatus === 0 || veriStatus === -1) {
      this.setState((state) => {
        const chain = state.chain;
        for (let i = index; i < chain.length; i++) {
          chain[i].verified = veriStatus;
        }
        return {
          chain,
        };
      });
    }
  }

  reVerification(index, transaction, timestamp) {
    if (index === 0) {
      return;
    }
    let prev_block = this.state.chain[index - 1];
    let prev_data = String(prev_block.previous_hash);
    prev_data = Buffer.from(prev_data, "utf8").toString("hex");
    let cur_data = String(index) + String(timestamp) + String(transaction);
    let cur_proof = 0;
    let cur_hash = "";
    while (cur_hash.substring(0, 2) !== "00") {
      cur_proof = cur_proof + 1;
      let cur_data_try = cur_data + String(cur_proof);
      //make previous has reverse to prevent constant 0s in front
      let pwd = prev_data.split("").reverse().join("") + cur_data_try;
      cur_hash = String(crypto.createHash("sha256").update(pwd).digest("hex"));
    }
    this.setState((state) => {
      let chain = state.chain;
      chain[index].previous_hash = cur_hash;
      chain[index].proof = cur_proof;
      chain[index].verified = 1;
      return {
        chain,
      };
    });
  }

  updateVerification(index, transaction, proof, timestamp) {
    if (index === 0) {
      return;
    }
    let prev_block = this.state.chain[index - 1];
    let prev_data = String(prev_block.previous_hash);
    prev_data = Buffer.from(prev_data, "utf8").toString("hex");
    let cur_data = String(index) + String(timestamp) + String(transaction);
    let cur_proof = proof;
    let cur_hash = "";
    let cur_data_try = cur_data + String(cur_proof);
    let pwd = prev_data.split("").reverse().join("") + cur_data_try;
    cur_hash = String(crypto.createHash("sha256").update(pwd).digest("hex"));
    this.setState((state) => {
      let chain = state.chain;
      chain[index].previous_hash = cur_hash;
      chain[index].proof = proof;
      chain[index].transaction = transaction;
      chain[index].timestamp = timestamp;
      if (cur_hash.substring(0, 2) === "00") {
        for (let i = index; i < chain.length; i++) {
          chain[i].verified = 0;
        }
      } else {
        for (let i = index; i < chain.length; i++) {
          chain[i].verified = -1;
        }
      }
      return {
        chain,
      };
    });
  }

  componentDidMount() {}

  render() {
    return (
      <div className="App">
        <Navbar
          style={{
            paddingLeft: "50px",
            paddingRight: "50px",
          }}
          bg="dark"
          variant="dark"
          expand="lg"
        >
          <Navbar.Brand style={{ fontWeight: "bold" }}>
            Mini BlockChain by Shiwei Zhou
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link href="http://www.terryzsw.com">
                Back to my home page
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className="container">
          <Modal.Dialog style={{ minWidth: "100%" }}>
            <Modal.Header>
              <Modal.Title>Instruction</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <div className="container">
                <p>
                  Click GenerateBlocks to create new blocks with content you
                  want in 'Next transaction' input box
                </p>
                <br />
                <p>
                  Change transaction coneten in block to see what will happen
                </p>
                <br />
                <p>
                  Click 'Re-Hash This Block' to generate new proof for valid
                  hash. (Valid hash have to start with 00)
                </p>
                <br />
                <p>
                  Green card means verified block. Yellow card means uncerified
                  block with valid hash. Red card means unvalid hash or broken
                  link.
                </p>
                <br />
              </div>
            </Modal.Body>

            <Modal.Footer>
              <p>Have Fun</p>
            </Modal.Footer>
          </Modal.Dialog>
        </div>
        <div
          className="row"
          style={{
            paddingLeft: "50px",
            paddingRight: "50px",
          }}
        >
          {this.state.chain.map((item) => (
            <BlockChainItem
              updateVerification={this.updateVerification}
              reVerification={this.reVerification}
              key={item.index}
              item={item}
              style={{ marginLeft: "20%", marginRight: "20%" }}
            />
          ))}
        </div>
        <br />
        <Form.Group
          controlId="transactionForm"
          style={{ marginLeft: "20%", marginRight: "20%" }}
        >
          <Form.Label>Next transaction</Form.Label>
          <Form.Control
            type="text"
            placeholder="It can be any message"
            onChange={(e) => this.handleTransacChange(e)}
          />
        </Form.Group>
        <Button
          variant="primary"
          onClick={(e) =>
            this.generateBlocks(
              this.state.chain.slice(-1)[0],
              this.state.currentTransaction,
              e
            )
          }
        >
          GenerateBlocks
        </Button>
      </div>
    );
  }
}

export default App;
