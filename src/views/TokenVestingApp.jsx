import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import { getTokenVesting, getSimpleToken } from '../contracts'

import Header from './Header'
import VestingDetails from './VestingDetails'
import VestingSchedule from './VestingSchedule'
import Spinner from './Spinner'

import '../stylesheets/TokenVestingApp.css'


class TokenVestingApp extends Component {
  constructor() {
    super()
    this.state = { name: 'Token', loading: true }
    window.ethereum.enable();
  }

  componentDidMount() {
    this.getData()
  }

  render() {
    const { address, token } = this.props
    return (
      <div className="TokenVestingApp">

        { this.state.loading ? <Spinner /> : null }

        <Header factory={false} address={ address } token={ token } tokenName={ this.state.name } />

        <Grid>
          <Row>
            <Col xs={12} md={6}>
              <VestingDetails
                address={ address }
                token={ token }
                details={ this.state }
                getData={ () => this.getData() }
                setLoader={ x => this.setLoader(x) }
              />
            </Col>

            <Col xs={12} md={6}>
              <VestingSchedule details={ this.state } />
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }

  setLoader(loading) {
    this.setState({ loading })
  }

  async getData() {
    const { address, token } = this.props

    const tokenVesting = await getTokenVesting(address)
    const tokenContract = await getSimpleToken(token)

    const start = parseInt(await tokenVesting.methods.start().call())
    const duration = parseInt(await tokenVesting.methods.duration().call())
    const end = parseInt(start) + parseInt(duration)
    const cliff = parseInt(await tokenVesting.methods.cliff().call())

    const balance  = await tokenContract.methods.balanceOf(address).call()
    const released = await tokenVesting.methods.released(token).call()
    const total = parseInt(balance) + parseInt(released)

    const releasable = await tokenVesting.methods._releasableAmount(tokenContract._address).call()
    console.log(releasable)

    let state = {
      start,
      end,
      cliff,
      total,
      released,
      releasable: parseInt(releasable),
      decimals: parseInt(await tokenContract.methods.decimals().call()),
      beneficiary: await tokenVesting.methods.beneficiary().call(),
      owner: await tokenVesting.methods.owner().call(),
      revocable: false,
      revoked: false,
      name: await tokenContract.methods.name().call(),
      symbol: await tokenContract.methods.symbol().call(),
      loading: false
    }

    console.log(state)
    this.setState(state)
  }
}


export default TokenVestingApp
