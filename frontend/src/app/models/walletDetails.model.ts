import { Wallet } from "./wallet.model";

interface Share {
    symbol: string,
    buying_price: number,
    
}

export interface WalletDetails {
    wallet: Wallet,
    shares: Share[],
}