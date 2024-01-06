import { expect, use } from 'chai'
import { hash160, toByteString } from 'scrypt-ts-btc'
import { DemoBitVM } from '../src/contracts/demoBitvm'
import { getDefaultSigner } from './utils/txHelper'
import chaiAsPromised from 'chai-as-promised'
use(chaiAsPromised)

describe('Test SmartContract `DemoBitVM`', () => {
    let instance: DemoBitVM

    const secretA = toByteString(
        '7f5b1bc34513931257bb7520d175079c29b18c54812c938cdc6c66a277111bf7'
    )
    const secretB = toByteString(
        '58b79cc3b0cfeb8e00561686416f09c355fed61fc13337b0d2fc914a3946759c'
    )
    const secretE = toByteString(
        '55fe3e4a446371d0d522e63662cac69d9e77cd7e87038bcb0fe126a60f24e0f9'
    )

    before(async () => {
        await DemoBitVM.loadArtifact()

        // Create commitment for gate E = A nand B.
        const hashPairA = {
            hash0: hash160(secretA + toByteString('00')),
            hash1: hash160(secretA + toByteString('01')),
        }
        const hashPairB = {
            hash0: hash160(secretB + toByteString('00')),
            hash1: hash160(secretB + toByteString('01')),
        }
        const hashPairE = {
            hash0: hash160(secretE + toByteString('00')),
            hash1: hash160(secretE + toByteString('01')),
        }

        instance = new DemoBitVM(hashPairA, hashPairB, hashPairE)
        await instance.connect(getDefaultSigner())
    })

    it('should pass the public method unit test successfully.', async () => {
        const deployTx = await instance.deploy(1000)
        console.log(`Deployed contract "DemoBitVM": ${deployTx.id}`)

        console.log(deployTx.uncheckedSerialize())

        if (process.env.NETWORK == 'testnet') {
            // Wait for 10 seconds...
            await new Promise((resolve) => setTimeout(resolve, 10000))
        }

        const call = async () => {
            // 1 = 0 nand 1
            const preimageA = secretA + toByteString('00')
            const preimageB = secretB + toByteString('01')
            const preimageE = secretE + toByteString('01')

            const callRes = await instance.methods.openGateCommit(
                preimageA,
                preimageB,
                preimageE
            )

            console.log(`Called "openGateCommit" method: ${callRes.tx.id}`)
        }
        await expect(call()).not.to.be.rejected
    })
})
