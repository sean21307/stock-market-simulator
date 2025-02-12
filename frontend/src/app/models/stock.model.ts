interface Price {
    date: string;
    closing_price: number;
}

interface StockInfo {
    symbol_id: string,
    name: string,
    description: string,
}

export interface Stock {
    stockInfo: StockInfo,
    prices: Price[]
}
