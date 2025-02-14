import os
from datetime import date
from pathlib import Path
import yfinance as yf

from MySQLdb import _mysql
from dotenv import load_dotenv

dotenv_path = Path('.env')
load_dotenv(dotenv_path=dotenv_path)

host = os.getenv("DB_HOST")
user = os.getenv("DB_USERNAME")
password = os.getenv("DB_PASS")
database = os.getenv("DB_NAME")
port = int(os.getenv("DB_PORT"))

db = _mysql.connect(host=host, user=user, password=password, database=database, port=port)

file = open('stock_ticker_constants.txt', 'r')
symbols = []
for line in file:
    symbols.append(line.rsplit(',',1)[0])

for symbol in symbols:
    sql = """
        SELECT max(date)
        FROM stocks_endofday
        WHERE symbol_id = 'AAPL';
        """

    db.query(sql)

    result = db.store_result()

    last_date = result.fetch_row()[0][0].decode('utf-8')
    current_date = date.today().strftime('%Y-%m-%d')

    stock_data = yf.download(symbol, interval="1d", start=last_date, end=current_date)
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