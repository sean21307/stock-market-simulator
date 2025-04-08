export interface OrderModel{
  id: number,
  type: string,
  symbol: string,
  quantity: number,
  target_price: number,
  status: string
}

export interface CreatedOrderModel{
  type: string,
  symbol: string,
  quantity: number,
  target_price: number
}
