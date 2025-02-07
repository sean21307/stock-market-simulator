import yfinance as yf
from datetime import date, timedelta


# Define the stock symbol and the time period
# stock_symbol = 'AAPL'
end_date = date.today() - timedelta(days=1)
start_date = end_date - timedelta(days=365)

file = open('stock_ticker_constants.txt', 'r')
symbols = []
for line in file:
    symbols.append(line.rsplit(',',1)[0])
for symbol in symbols:
    # Fetch the historical data
    stock_data = yf.download(symbol, interval="1d", start=start_date, end=end_date)

    # # Display the data
    stock_data.to_csv("stockdata/" + symbol + '_stockData.csv')