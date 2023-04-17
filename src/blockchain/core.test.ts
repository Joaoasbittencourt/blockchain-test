import { mineBlock, validateChain } from "./core"
import { BlockChain } from "./types"

describe("Blockchain", () => {
  it("should be able to mine block from scratch", async () => {
    const blockChain: BlockChain = {
      blocks: [],
      pendingTxs: [],
      difficulty: 2,
      reward: 10,
    }

    const block1 = await mineBlock(blockChain, "miner_address")
    blockChain.blocks.push(block1)
    const block2 = await mineBlock(blockChain, "miner_address")
    blockChain.blocks.push(block2)

    expect(validateChain(blockChain)).toBe(true)
  })
})
