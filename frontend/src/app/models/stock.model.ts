interface Price {
    date: string;
    closing_price: number;
}

interface StockInfo {
    symbol: string,
    companyName: string,
    description: string,
    price: number,
    changesPercentage: number,
    image: string,
}

export interface PartialStock {
    name: string,
    price: number,
    changesPercentage: number,
    image: string,
}

export interface Stock {
    stockInfo: StockInfo,
    prices: Price[]
}
