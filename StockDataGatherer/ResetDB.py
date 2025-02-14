from datetime import timedelta, datetime
import yfinance as yf

from StockDataGatherer.dbConn import db


current_date = datetime.now()
current_date_minus_760d = current_date - timedelta(days = 760)
sql = "DELETE FROM stocks_endofday"
db.query(sql)

file = open('stock_ticker_constants.txt', 'r')
symbols = []
for line in file:
    symbols.append(line.rsplit(',',1)[0])

for symbol in symbols:
    stock_data = yf.download(symbol, interval="1d", start=current_date_minus_760d, end=current_date)
    for row in stock_data.itertuples():
        date = row[0]
        closing = row[1]
        opening = row[2]
        min_price = row[3]
        max_price = row[4]
        volume = row[5]
        symbol_id = symbol

        sql = format("insert into stocks_endofday (date, closing_price, open_price, min_price, max_price, volume, symbol_id)"
                     "VALUES ('{}', {}, {}, {}, {}, {}, '{}')"
                     .format(date, closing, opening, min_price, max_price, volume, symbol_id))
        db.query(sql)