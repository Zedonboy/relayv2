/* eslint-disable no-console */

const { noise } = require('@chainsafe/libp2p-noise')
const { yamux } = require('@chainsafe/libp2p-yamux')
const { circuitRelayServer } = require('@libp2p/circuit-relay-v2')
const { identify } = require('@libp2p/identify')
const { webSockets } = require('@libp2p/websockets')
const { createLibp2p } = require('libp2p')

async function main () {
  const node = await createLibp2p({
    addresses: {
      listen: ['/ip4/0.0.0.0/tcp/3000/ws']
      // TODO check "What is next?" section
    },
    transports: [
      webSockets()
    ],
    connectionEncrypters: [
      noise()
    ],
    streamMuxers: [
      yamux()
    ],
    services: {
      identify: identify(),
      relay: circuitRelayServer()
    }
  })

  console.log(`Node started with id ${node.peerId.toString()}`)
  console.log('Listening on:')
  node.getMultiaddrs().forEach((ma) => console.log(ma.toString()))
}

main()