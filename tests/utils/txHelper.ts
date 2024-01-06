import {
    DummyProvider,
    BlockstreamProvider,
    TestWallet,
    btc,
} from 'scrypt-ts-btc'
import { myPrivateKey } from './privateKey'

import * as dotenv from 'dotenv'

// Load the .env file
dotenv.config()

const wallets: Record<string, TestWallet> = {
    testnet: new TestWallet(
        myPrivateKey,
        new BlockstreamProvider(btc.Networks.testnet)
    ),
    local: new TestWallet(myPrivateKey, new DummyProvider()),
    mainnet: new TestWallet(
        myPrivateKey,
        new BlockstreamProvider(btc.Networks.testnet)
    ),
}
export function getDefaultSigner(
    privateKey?: btc.PrivateKey | btc.PrivateKey[]
): TestWallet {
    const network = process.env.NETWORK || 'local'

    const wallet = wallets[network]

    if (privateKey) {
        wallet.addPrivateKey(privateKey)
    }

    return wallet
}

export const sleep = async (seconds: number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({})
        }, seconds * 1000)
    })
}

export function randomPrivateKey() {
    const privateKey = btc.PrivateKey.fromRandom(btc.Networks.testnet)
    const publicKey = btc.PublicKey.fromPrivateKey(privateKey)
    const address = privateKey.toAddress(
        btc.Networks.testnet,
        btc.Address.PayToWitnessPublicKeyHash
    )
    return [privateKey, publicKey, address] as const
}
