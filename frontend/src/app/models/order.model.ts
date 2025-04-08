export interface Order {
  id?: number,
  type: "buy" | "sell",
  symbol: string,
  quantity: number,
  target_price: number,
  status?: "PENDING" | "COMPLETED" | "FAILED"
}