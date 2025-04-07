import requests

from dbConn import db
import os
from dotenv import load_dotenv
import fmpsdk
from constants import symbols_list

load_dotenv()
apikey = os.environ.get("API_KEY")
backend_url = os.environ.get("BACKEND_URL")

def get_stock_prices():
    sql = "SELECT DISTINCT symbol from wallets_order"
    c = db.cursor()
    c.execute(sql)
    rows = list(c.fetchall())
    symbols = [item[0] for item in rows]
    return fmpsdk.quote(apikey, symbol=symbols)


def check_orders():
    stocks = get_stock_prices();

    stock_prices = dict()
    for stock in stocks:
        stock_prices[stock['symbol']] = stock['price']

    sql = "SELECT * FROM wallets_order"
    c = db.cursor()
    c.execute(sql)
    rows = c.fetchall()

    for row in rows:
        if(row[1] == "buy"):
            if(stock_prices[row[2]] <= row[4]):
                requests.post(backend_url + "/wallets/complete-buy-order/" + str(row[5]) + "/" + str(row[0]), data= {"stock_price": stock_prices[row[2]]})

        else:
            if(stock_prices[row[2]] >= row[4]):
                requests.post(backend_url + "/wallets/complete-sell-order/" + str(row[5]) + "/" + str(row[0]),data={"stock_price": stock_prices[row[2]]})