from stocks.models import EndOfDay, Stock

stock_constants = open('stocks/stock_ticker_constants.txt','r')

count = 0
for line in stock_constants.readlines():
    stock_symbol = line.rsplit(',')[0]
    stock_name = line.rsplit(',')[1].replace('\n','')
    stock = Stock(symbol_id=stock_symbol, name=stock_name, description="placeholder")
    stock.save()
    csv = open('stocks/stockdata/' + stock_symbol + '_stockData.csv','r')
    for endOfDay in csv:
        date = endOfDay.split(',')[0]
        if date.startswith('20'):
            close = endOfDay.split(',')[1]
            high = endOfDay.split(',')[2]
            low = endOfDay.split(',')[3]
            open_price = endOfDay.split(',')[4]
            volume = endOfDay.split(',')[5]
            entry = EndOfDay(
                date=date,
                closing_price=close,
                max_price=high,
                min_price=low,
                open_price= open_price,
                volume=volume,
                symbol_id=stock
            )
            entry.save()
    print(stock_symbol + ":" + stock_name)

print(count)