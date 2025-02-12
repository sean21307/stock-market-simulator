def getStockData(stock_symbol):
    csv = open("stocks/stockdata/" + stock_symbol + "_stockData.csv")
    entries = []
    for line in csv.readlines():
        date = line.split(',')[0]
        closing_price = line.split(',')[1]

        if(date.startswith("2024")):
            entries.append({"date":date, "closing_price":closing_price})
    return entries
