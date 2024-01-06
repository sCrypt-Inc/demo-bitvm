import { BtcDemo } from './src/contracts/btcDemo'
import {
    btc,
    TestWallet,
    BlockstreamProvider,
    sha256,
    toByteString,
} from 'scrypt-ts-btc'

import * as dotenv from 'dotenv'

// Load the .env file
dotenv.config()

// Read the private key from the .env file.
// The default private key inside the .env file is meant to be used for the Bitcoin testnet.
// See https://scrypt.io/docs/bitcoin-basics/bsv/#private-keys
const privateKey = btc.PrivateKey.fromWIF(process.env.PRIVATE_KEY || '')

// Prepare signer.
// See https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#prepare-a-signer-and-provider
const signer = new TestWallet(
    privateKey,
    new BlockstreamProvider(btc.Networks.testnet)
)

async function main() {
    await BtcDemo.compile()

    // TODO: Adjust the amount of satoshis locked in the smart contract:
    const amount = 1000

    const instance = new BtcDemo(
        // TODO: Adjust constructor parameter values:
        sha256(toByteString('hello world', true))
    )

    // Connect to a signer.
    await instance.connect(signer)

    // Contract deployment.
    const deployTx = await instance.deploy(amount)
    console.log(`BtcDemo contract deployed: ${deployTx.id}`)
}

main()
