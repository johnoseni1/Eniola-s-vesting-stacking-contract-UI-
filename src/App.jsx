import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import Web3 from 'web3'

import TokenVestingApp from './views/TokenVestingApp'
import PurchaseApp from './views/PurchaseApp'


const App = () => (
  <Router>
    <Switch>
      <Route path="/:address/:token" component={ Main }/>
      <Route component={ PurchaseApp } />
    </Switch>
  </Router>
)

const Main = function({ match }) {
  let web3 = new Web3()
  let { address, token } = match.params

  // TODO validate TokenVesting address
  return web3.utils.isAddress(address)
    ? <TokenVestingApp address={ address } token={ token } />
    : <PurchaseApp />
}

export default App