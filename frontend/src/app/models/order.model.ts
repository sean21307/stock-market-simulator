export interface Order {
  id?: number,
  type: "Buy" | "Sell",
  symbol: string,
  quantity: number,
  target_price: number,
  status?: "PENDING" | "COMPLETED" | "FAILED"
}