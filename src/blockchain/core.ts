import { padleft } from "../utils/pad"
import { Block, BlockChain, KeyPair, Transaction } from "./types"
import { COINBASE_ADDRESS, GENESIS_HASH } from "./constants"
import { blockHash, signTx } from "./hash"
import { last } from "../utils/array"

const difficultyPrefix = (difficulty: number) => padleft("", difficulty, "0")

export const balance = (address: string, chain: Block[]) =>
  chain.reduce(
    (acc, block) =>
      acc +
      block.txs.reduce((acc, tx) => {
        if (tx.from === address) return acc - tx.amount
        if (tx.to === address) return acc + tx.amount
        return acc
      }, 0),
    0
  )

export const mineBlock = async (
  blockchain: BlockChain,
  { publicKey: minerAddress, privateKey: minerPk }: KeyPair
): Promise<BlockChain> => {
  const { blocks, pendingTxs, difficulty, reward } = blockchain

  let hash = ""
  let nonce = 0

  const latest = blocks.length ? last(blocks) : null
  const prefix = difficultyPrefix(difficulty)
  const coinbase = signTx(
    {
      from: COINBASE_ADDRESS,
      to: minerAddress,
      amount: reward,
    },
    minerPk
  )

  const preblock = {
    txs: [coinbase, ...pendingTxs],
    previousHash: latest ? latest.hash : GENESIS_HASH,
  }

  return new Promise((resolve) => {
    while (!hash.startsWith(prefix)) {
      nonce++
      hash = blockHash({ ...preblock, nonce })
    }

    const newBlock = { ...preblock, nonce, hash, timestamp: Date.now() }

    resolve({
      ...blockchain,
      blocks: [...blocks, newBlock],
      pendingTxs: [],
    })
  })
}

export const appendTx = (chain: BlockChain, tx: Transaction) => {
  const { pendingTxs } = chain
  return {
    ...chain,
    pendingTxs: [...pendingTxs, tx],
  }
}
