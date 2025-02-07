interface Price {
    date: string;
    closing_price: number;
}

interface StockInfo {
    symbol: string,
    name: string,
    description: string,
}

export interface Stock {
    stockInfo: StockInfo,
    prices: Price[]
}