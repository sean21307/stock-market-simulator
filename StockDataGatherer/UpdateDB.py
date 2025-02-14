
from datetime import date, datetime, timedelta

import pandas as pd

from dbConn import db
import yfinance as yf


file = open('stock_ticker_constants.txt', 'r')
symbols = []
for line in file:
    symbols.append(line.rsplit(',',1)[0])

for symbol in symbols:
    sql = "SELECT max(date) FROM stocks_endofday WHERE symbol_id = '" + symbol +"';"
    db.query(sql)
    result = db.store_result()
    last_datetime_byte_str = result.fetch_row()[0][0].decode('utf8')
    last_datetime = pd.to_datetime(last_datetime_byte_str)
    current_datetime = datetime.now()
    print("Putting 1 minute data for " + symbol + " from " + str(last_datetime) + " to " + str(current_datetime))

    stock_data = yf.download(symbol, interval="1m", start=last_datetime, end=current_datetime)
    for row in stock_data.itertuples():
        date = row[0]
        closing = row[1]
        opening = row[2]
        min_price = row[3]
        max_price = row[4]
        volume = row[5]
        symbol_id = symbol

        sql = format(
            "insert into stocks_endofday (date, closing_price, open_price, min_price, max_price, volume, symbol_id)"
            "VALUES ('{}', {}, {}, {}, {}, {}, '{}')"
            .format(date, closing, opening, min_price, max_price, volume, symbol_id))
        db.query(sql)

