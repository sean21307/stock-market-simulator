interface Price {
    date: string;
    closing_price: number;
}

interface StockInfo {
    symbol: string,
    companyName: string,
    description: string,
    industry: string,
    fullTimeEmployees: number,
    mktCap: number,
    price: number,
    changesPercentage: number,
}

export interface PartialStock {
    name: string,
    price: number,
    changesPercentage: number,
}

export interface Stock {
    stockInfo: StockInfo,
    prices: Price[]
}
