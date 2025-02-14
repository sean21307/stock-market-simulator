import yfinance as yf
from yfinance import Market

ticker = yf.Ticker("AAPL").fast_info # Use any valid ticker symbol

print(ticker.get('exchange'))


print(market.status.get('status'))
