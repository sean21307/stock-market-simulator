

from dbConn import db
import os
from dotenv import load_dotenv
import fmpsdk

load_dotenv()
apikey = os.environ.get("API_KEY")


sql = "DELETE FROM stocks_stock;"
db.query(sql)

stocks = fmpsdk.symbols_list(apikey)
print(stocks)
for stock in stocks:
    try:
        symbol_id = stock['symbol']
        name = stock['name']
        exchange = stock['exchangeShortName']

        sql = format("INSERT INTO stocks_stock (symbol_id, name, exchange) "
                     'VALUES ("{}", "{}","{}")'
                     .format(symbol_id, name, exchange))
        db.query(sql)
    except Exception as e:
        print(stock)

