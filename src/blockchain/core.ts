import { SHA256 } from "crypto-js"
import { padleft } from "../utils/pad"
import { Block, DraftBlock, BlockChain } from "./types"
import { GENESIS_HASH, generateCoinbaseTx } from "./generators"

const balance = (address: string, chain: Block[]) =>
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

const blockHash = (block: DraftBlock) =>
  SHA256(
    `${block.previousHash}:${block.nonce}:${block.txs
      .map((tx) => `${tx.from}->${tx.to}:${tx.amount}`)
      .join(",")}`
  ).toString()

const getLatestBlock = (chain: Block[]) => (chain.length ? chain[chain.length - 1] : null)

const difficultyPrefix = (difficulty: number) => padleft("", difficulty, "0")

export const mineBlock = async (
  { blocks, pendingTxs, difficulty, reward }: BlockChain,
  minerAddress: string
): Promise<Block> => {
  let hash = ""
  let nonce = 0

  const latest = getLatestBlock(blocks)
  const prefix = difficultyPrefix(difficulty)
  const coinbase = generateCoinbaseTx({ reward }, minerAddress)

  const preblock = {
    txs: [coinbase, ...pendingTxs],
    previousHash: latest ? latest.hash : GENESIS_HASH,
  }

  return new Promise((resolve) => {
    while (!hash.startsWith(prefix)) {
      nonce++
      hash = blockHash({ ...preblock, nonce })
    }

    resolve({ ...preblock, nonce, hash, timestamp: Date.now() })
  })
}

export const validateBlock = (block: Block) => block.hash === blockHash(block)

export const validateChain = (chain: BlockChain) => {
  const { blocks } = chain

  for (const block of blocks) {
    console.log("blockHash", blockHash(block))
    if (!validateBlock(block)) {
      console.log(block)
      return false
    }
  }

  return true
}
