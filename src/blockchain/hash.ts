import { SHA256 } from "crypto-js"
import { DraftBlock, Transaction } from "./types"
import { ec } from "elliptic"
const elliptic = new ec("secp256k1")

const hash = (data: string) => SHA256(data).toString()

export const genKeyPair = () => {
  const key = elliptic.genKeyPair()
  const publicKey = key.getPublic("hex")
  const privateKey = key.getPrivate("hex")
  return { publicKey, privateKey }
}

export const signString = (string: string, privateKey: string) => {
  const key = elliptic.keyFromPrivate(privateKey, "hex")
  const signature = key.sign(string).toDER("hex")
  return signature
}

export const verifySignature = (str: string, sig: string, pkey: string) => {
  const key = elliptic.keyFromPublic(pkey, "hex")
  return key.verify(str, sig)
}

export const blockHash = (block: DraftBlock) => {
  const txString = block.txs.map(txHash).join(",")
  const blockString = `${block.previousHash}:${block.nonce}:${txString}`
  return SHA256(blockString).toString()
}

export const txHash = (tx: Omit<Transaction, "signature">) =>
  hash(`${tx.from}:${tx.to}:${tx.amount}`)

export const signTx = (tx: Omit<Transaction, "signature">, privateKey: string) => {
  const txHash = hash(`${tx.from}:${tx.to}:${tx.amount}`)
  const signature = signString(txHash, privateKey)
  return { ...tx, signature }
}
