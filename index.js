/* eslint-disable no-console */

import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { circuitRelayServer } from '@libp2p/circuit-relay-v2'
import { identify } from '@libp2p/identify'
import { webSockets } from '@libp2p/websockets'
import { createLibp2p } from 'libp2p'

if (!Promise.withResolvers) {
  Promise.withResolvers = function() {
      let resolve, reject;

      const promise = new Promise((res, rej) => {
          resolve = res;
          reject = rej;
      });

      // wait a bit
      while (resolve === undefined || reject === undefined) {}

      return { promise, resolve, reject };
  };
}
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
      identify: identify({
        protocolPrefix: "fusion"
      }),
      relay: circuitRelayServer()
    }
  })

  console.log(`Node started with id ${node.peerId.toString()}`)
  console.log('Listening on:')
  node.getMultiaddrs().forEach((ma) => console.log(ma.toString()))
}

main()