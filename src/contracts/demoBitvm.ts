import {
    assert,
    ByteString,
    hash160,
    method,
    prop,
    Ripemd160,
    SmartContract,
} from 'scrypt-ts-btc'

type HashPair = {
    hash0: Ripemd160
    hash1: Ripemd160
}

export class DemoBitVM extends SmartContract {
    @prop()
    hashPairA: HashPair

    @prop()
    hashPairB: HashPair

    @prop()
    hashPairE: HashPair

    constructor(hashPairA: HashPair, hashPairB: HashPair, hashPairE: HashPair) {
        super(...arguments)
        this.hashPairA = hashPairA
        this.hashPairB = hashPairB
        this.hashPairE = hashPairE
    }

    @method()
    public openGateCommit(
        preimageA: ByteString,
        preimageB: ByteString,
        preimageE: ByteString
    ) {
        const bitA = DemoBitVM.bitValueCommit(this.hashPairA, preimageA)
        const bitB = DemoBitVM.bitValueCommit(this.hashPairB, preimageB)
        const bitE = DemoBitVM.bitValueCommit(this.hashPairE, preimageE)
        assert(DemoBitVM.nand(bitA, bitB) == bitE)
    }

    @method()
    static bitValueCommit(hashPair: HashPair, preimage: ByteString): boolean {
        const h = hash160(preimage)
        assert(h == hashPair.hash0 || h == hashPair.hash1)
        return h == hashPair.hash1
    }

    @method()
    static nand(A: boolean, B: boolean): boolean {
        return !(A && B)
    }
}
