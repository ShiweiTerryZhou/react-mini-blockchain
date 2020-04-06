import React, { Component } from "react";
import "./App.css";
import update from 'immutability-helper';
import BlockChainItem from './components/BlockChainItem'
const crypto = require('crypto')

class App extends Component {
  constructor(props) {
    super(props)
    let today = new Date();
    this.state = {
      chain: [
        {
          index: 0,
          timestamp: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
          proof: 1,
          transaction: '',
          previous_hash: '0'
        }
      ]
    }

    this.generateBlocks = this.generateBlocks.bind(this);
  }

  generateBlocks(prev_block, transaction) {
    let prev_data = String(prev_block.previous_hash);
    prev_data = Buffer.from(prev_data, 'utf8').toString('hex');

    let today = new Date();
    let time = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let cur_data = String(prev_block.index + 1) + String(time)
      + String(transaction)
    let cur_proof = 0;
    let cur_hash = "";

    //let pwd = parseInt(prev_data, 16) - parseInt(cur_data_encode, 16)
    //console.log(String(crypto.createHash('sha256').update(pwd).digest('hex')))
    while (cur_hash.substring(0, 2) !== '00') {
      console.log(cur_hash)
      cur_proof = cur_proof + 1;
      let cur_data_try = cur_data + String(cur_proof)
      //make previous has reverse to prevent constant 0s in front
      let pwd = prev_data.split("").reverse().join("") + cur_data_try
      console.log(pwd)
      cur_hash = String(crypto.createHash('sha256').update(pwd).digest('hex'));
    }

    let new_block = {
      index: prev_block.index + 1,
      timestamp: time,
      proof: cur_proof,
      transaction: transaction,
      previous_hash: cur_hash
    };
    this.setState(state => {
      const chain = state.chain.concat(new_block);
      return {
        chain
      }
    });
  }


  componentDidMount() {
    //let today = new Date();
    //let time = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    //this.setState({
    //  chain: update(this.state.chain, { 0: { timestamp: { $set: time } } })
    //})
  }

  render() {
    console.log(this.state);
    //console.log(this.state.chain.slice(-1)[0])
    return (<div className="App">
      {this.state.chain.map(item => (
        <BlockChainItem key={item.index} item={item} />
      ))}

      <button onClick={(e) => this.generateBlocks(this.state.chain.slice(-1)[0], 'A->B 10', e)}> generate block </button>
    </div>);
  }
}

export default App;
