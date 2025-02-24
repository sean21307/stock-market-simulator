interface Price {
    date: string;
    closing_price: number;
}

interface StockInfo {
    symbol: string,
    companyName: string,
    description: string,
}

export interface Stock {
    stockInfo: StockInfo,
    prices: Price[]
}
