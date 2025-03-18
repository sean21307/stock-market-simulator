import { Wallet } from "./wallet.model";

export interface Share {
    symbol: string,
    quantity: number,
    buying_price: number,
}

interface WalletValue{
  date: string,
  value: number
}

export interface WalletDetails {
    wallet: Wallet,
    shares: Share[],
    wallet_values_overtime: WalletValue[]
}
