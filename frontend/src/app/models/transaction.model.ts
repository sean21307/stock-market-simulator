export interface Transaction {
    // is not returned from request
    type: string,

    // returned from request
    symbol: string,
    quantity_purchased: string,
    quantity_sold: string;
    price_per_share: string,
    total_price: string,
    date: string,
    profit?: string
}