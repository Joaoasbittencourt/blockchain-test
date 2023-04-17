import { Block, BlockChain } from "./types"

export const GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000"

export const generateCoinbaseTx = ({ reward }: Pick<BlockChain, "reward">, to: string) => ({
  from: "COINBASE",
  to,
  amount: reward,
})
