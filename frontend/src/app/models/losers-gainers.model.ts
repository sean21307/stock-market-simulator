export interface LoserModel{
  ticker: string,
  changes: number,
  price: number,
  changesPercentage: number,
  companyName: string
}

export interface WinnerModel{
  ticker: string,
  changes: number,
  price: number,
  changesPercentage: number,
  companyName: string
}
