export interface Order {
  id?: number,
  type: "Buy" | "Sell",
  symbol: string,
  quantity: number,
  target_price: number,
  date?: 'string',
  status?: "PENDING" | "COMPLETED" | "FAILED"
}