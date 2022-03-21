import Network from "./network"

export async function getTokenVesting(address) {
  let _eth = await Network.eth();
  
  const TokenVesting = new _eth.Contract(require('./contracts/TokenVesting.json'), address)
  const provider = await Network.provider()
  TokenVesting.setProvider(provider)
  console.log(TokenVesting)
  return TokenVesting
}

export async function getSimpleToken(address) {
  let _eth = await Network.eth();

  const SimpleToken = new _eth.Contract(require('./contracts/LIX.json'), address)
  const provider = await Network.provider()
  SimpleToken.setProvider(provider)
  return SimpleToken
}

export async function getVestingFactory(address) {
  let _eth = await Network.eth();

  const VestingFactory = new _eth.Contract(require('./contracts/VestingFactory.json'), address)
  const provider = await Network.provider()
  VestingFactory.setProvider(provider)
  return VestingFactory
}