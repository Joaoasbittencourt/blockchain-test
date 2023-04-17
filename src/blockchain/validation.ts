import { first, tail } from "../utils/array"
import { COINBASE_ADDRESS, GENESIS_HASH } from "./constants"
import { blockHash, txHash, verifySignature } from "./hash"
import { Block, BlockChain, Transaction } from "./types"

export const validateTx = (tx: Transaction) => {
  const { from, signature } = tx
  const hash = txHash(tx)
  return verifySignature(hash, signature, from)
}

export const validateBlock = (block: Block) =>
  blockHash(block) === block.hash &&
  first(block.txs).from === COINBASE_ADDRESS &&
  tail(block.txs).every(validateTx)

export const validateChain = ({ blocks }: BlockChain) => {
  for (let i = 0; i < blocks.length; i++) {
    const isFirstBlock = i === 0
    const currentBlock = blocks[i]
    const validBlock = validateBlock(currentBlock)
    const validHash = isFirstBlock
      ? currentBlock.previousHash === GENESIS_HASH
      : currentBlock.previousHash === blocks[i - 1].hash

    if (!validHash || !validBlock) {
      return false
    }
  }

  return true
}
