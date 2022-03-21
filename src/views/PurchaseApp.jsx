import React, { Component } from 'react'
import { Grid, Row, Col, Button } from 'react-bootstrap'
import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom'

import { getVestingFactory, getSimpleToken } from '../contracts'

import Header from './Header'
import VestingDetails from './VestingDetails'
import VestingSchedule from './VestingSchedule'
import Spinner from './Spinner'

import '../stylesheets/TokenVestingApp.css'

import { displayAmount } from '../utils'
import Network from '../network'

const _vestingFactory = '0x3A556ad4bef69b54dF717e331D91833d60C71848' //Vesting Factory / LIX //TODO
const _usdc = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' //USDC TODO
const _lix = '0xd0345D30FD918D7682398ACbCdf139C808998709' //LIX todo
class PurchaseApp extends Component {
  constructor() {
    super()
    this.state = { name: 'LIX', amount: 0, loading: false, vestings: []}
    window.ethereum.enable();

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({amount: event.target.value});
  }

  async handleUnlock(event) {
    const usdc = await getSimpleToken(_usdc)//USDC ADDRESS TODO
    const accounts = await Network.getAccounts()
    const cost = this.state.amount * 1500000

    this.setState({loading: true})
    await usdc.methods.increaseAllowance(_vestingFactory, cost).send( { from: accounts[0] }, ()=>{this.setState({loading: false})})

    event.preventDefault();
  }

  async handlePurchase(event) {
    const vestingFactory = await getVestingFactory(_vestingFactory) //TODO
    const accounts = await Network.getAccounts()

    this.setState({loading: true})
    await vestingFactory.methods.purchaseWithUSDC(this.state.amount).send( { from: accounts[0] }, ()=>{this.setState({loading: false})})

    event.preventDefault();
  }

  componentDidMount() {
    this.getData()
  }

  render() {
    const { address, token } = [_vestingFactory, _lix] 
    return (
      <div className="TokenVestingApp">

        <Header factory={true} address={ address } token={ token } tokenName={ this.state.name } />

        { this.state.loading ? <Spinner /> : null }
        <Grid>
          <Row>
            <Col xs={12} md={6}>
              <label>
                Amount of LIX to purchase:
                <input type="number" name="amount" value={this.state.value} onChange={this.handleChange} />
              </label>
                <Row>
                  <p>Costs (1.5 USD/LIX): ${this.state.amount*1.5}</p>
                </Row>
                <Row>
                  1. <Button bsStyle="primary" onClick={this.handleUnlock.bind(this)}>Unlock USDC</Button>
                </Row>
                <Row>
                  2. Wait for transaction to confirm
                </Row>
                <Row>
                3. <Button bsStyle="info" onClick={this.handlePurchase.bind(this)}>Purchase and Vest </Button>
                </Row>
                <Row>
                4. Refresh the page when confirmed. Sorry about the UI, we used standard openzeppelin code for safety.
                </Row>
            </Col>

            <Col xs={12} md={6}>
              Your Vestings:
              <ul>
              {
                this.state.vestings.map((vest) => <li>
                  <Link to={`${vest.returnValues.vestingContractAddress}/${_lix}`} >{vest.returnValues.vestingContractAddress}</Link>
                </li>)
              }
              </ul>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }

  async getData() {
    const vestingFactory = await getVestingFactory(_vestingFactory) //TODO

    const accounts = await Network.getAccounts()

    let vests = await vestingFactory.getPastEvents("VestingCreated", { filter: {beneficiary: accounts[0]}, fromBlock: 1});

    // vests = vests.filter(vest => vest.returnValues.beneficiary.toLowerCase() == accounts[0])

    this.setState({vestings: vests})
    console.log(vests)

  }
}


export default PurchaseApp
