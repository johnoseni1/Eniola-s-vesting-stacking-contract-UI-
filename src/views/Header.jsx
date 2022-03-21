import React from 'react'
import { Grid, Col, Button } from 'react-bootstrap'
import { ContractLink, TokenLink } from './Links'

function Header({ factory, address, token, tokenName }) {
  return ( 
    <header className="header">
      <Grid>
        <Col xs={12}>
          <a target="_blank" href="https://openzeppelin.org" rel="noopener noreferrer">
            <img className="logo hidden-xs hidden-sm" src="/logo-zeppelin.png" alt="OpenZeppelin logo" />
          </a>
          <div className="contracts">
            <h3>{ factory ? "Vested Token Purchase Contract: 0x3a556ad4bef69b54df717e331d91833d60c71848" : "Vesting address:"} <ContractLink address={ address } /></h3>
            <span>For <TokenLink address={ token } name={ tokenName } /> token</span>
          </div>
        </Col>
        <Col>
        {/* {
          window.ethereum.isConnected() ?
          <p>Connected</p> : 
          <Button bsStyle="primary" onClick={alert()}>Connect Metamask</Button>
        } */}
        
        </Col>
      </Grid>
    </header>
  )
}

export default Header