export type BlockChain = {
  blocks: Block[]
  pendingTxs: Transaction[]
  difficulty: number
  reward: number
}

export type Block = {
  nonce: number
  timestamp: number
  txs: Transaction[]
  previousHash: string
  hash: string
}

export type DraftBlock = Omit<Block, "hash" | "timestamp">

export type Transaction = {
  from: string
  to: string
  amount: number
  signature: string
}

export type KeyPair = {
  publicKey: string
  privateKey: string
}
