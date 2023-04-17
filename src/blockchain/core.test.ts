import { appendTx, balance, mineBlock } from "./core"
import { genKeyPair, signTx } from "./hash"
import { BlockChain } from "./types"
import { validateChain } from "./validation"

const bob = {
  publicKey:
    "04335c4094c9ed3a778e0122011267fd005a1f4427124cf592d77ab65873ee8bf3dface9591003745c940f2603881099c8e734ff303dbf6b427957411adf9e2d77",
  privateKey: "2af1269136a7c5afa1169cd67e1189d07f4e8fa8fb37e8d344e28639b1da2518",
}

const alice = {
  publicKey:
    "0467abbd78427f179b820d61c6463f094e30a7b6b7980d946984ab3a158cc2ef5e5e6c210685bec34510e398052d861304fd0dda6355def802d435e0788746b8c2",
  privateKey: "1518be123910be7f2d30788330666287e287fd393548816d488f8fa551d57957",
}

describe("Blockchain", () => {
  it("should be able to mine block from scratch", async () => {
    let blockchain: BlockChain = {
      blocks: [],
      pendingTxs: [],
      difficulty: 2,
      reward: 10,
    }

    blockchain = await mineBlock(blockchain, bob)
    blockchain = await mineBlock(blockchain, bob)

    expect(validateChain(blockchain)).toBe(true)
    expect(balance(bob.publicKey, blockchain.blocks)).toBe(20)
  })

  it("should be able to send coins", async () => {
    let blockchain: BlockChain = {
      blocks: [],
      pendingTxs: [],
      difficulty: 2,
      reward: 10,
    }

    blockchain = await mineBlock(blockchain, bob)

    blockchain = appendTx(
      blockchain,
      signTx(
        {
          from: bob.publicKey,
          to: alice.publicKey,
          amount: 5,
        },
        bob.privateKey
      )
    )

    blockchain = await mineBlock(blockchain, bob)

    expect(validateChain(blockchain)).toBe(true)
    expect(balance(bob.publicKey, blockchain.blocks)).toBe(15)
    expect(balance(alice.publicKey, blockchain.blocks)).toBe(5)
  })
})
