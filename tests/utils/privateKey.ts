import { btc } from 'scrypt-ts-btc'
import * as dotenv from 'dotenv'
import * as fs from 'fs'

export function genPrivKey(network: btc.Networks.Network): btc.PrivateKey {
    dotenv.config({
        path: '.env',
    })

    const privKeyStr = process.env.PRIVATE_KEY
    let privKey: btc.PrivateKey
    let addr: btc.Address
    if (privKeyStr) {
        privKey = btc.PrivateKey.fromWIF(privKeyStr as string)
        addr = privKey.toAddress(network, btc.Address.PayToWitnessPublicKeyHash)
        console.log(`Private key already present ...`)
    } else {
        privKey = btc.PrivateKey.fromRandom(network)
        addr = privKey.toAddress(network, btc.Address.PayToWitnessPublicKeyHash)
        console.log(`Private key generated and saved in "${'.env'}"`)
        console.log(`Publickey: ${privKey.publicKey}`)
        console.log(`Address: ${addr.toString()}`)
        fs.writeFileSync('.env', `PRIVATE_KEY="${privKey}"`)
    }

    const fundMessage = `You can fund its address '${addr.toString()}' using a faucet, such as https://bitcoinfaucet.uo1.net/`

    console.log(fundMessage)

    return privKey
}

export const myPrivateKey = genPrivKey(btc.Networks.testnet)
export const myPublicKey = btc.PublicKey.fromPrivateKey(myPrivateKey)
export const myAddress = myPrivateKey.toAddress(
    btc.Networks.testnet,
    btc.Address.PayToWitnessPublicKeyHash
)
