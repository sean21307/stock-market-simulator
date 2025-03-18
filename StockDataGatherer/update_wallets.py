import datetime

from dbConn import db
import os
from dotenv import load_dotenv
import fmpsdk
from constants import symbols_list

load_dotenv()
apikey = os.environ.get("API_KEY")

def update_wallets():
    stocks = fmpsdk.quote(apikey=apikey,symbol=symbols_list)

    stock_prices = dict()
    for stock in stocks:
        stock_prices[stock['symbol']] = stock['price']

    sql = "SELECT count(symbol), symbol, wallet_id FROM wallets_share GROUP BY symbol, wallet_id ORDER BY wallet_id;"
    c = db.cursor()
    c.execute(sql)
    rows = c.fetchall()
    curr_wallet_id = rows[0][2]
    balance = 0
    values = ""
    for row in rows:
        print(row)
        quant = row[0]
        symbol = row[1]
        wallet_id = row[2]
        if curr_wallet_id != wallet_id:
            values = values + "(" + str(balance) + "," + str(curr_wallet_id) +",'" + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f") + "'),"
            curr_wallet_id = wallet_id
            balance = 0
        balance = balance + (stock_prices[symbol] * quant)
    values = values + "(" + str(balance) + "," + str(curr_wallet_id) +",'" + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f") + "')"
    print(values)

    sql = "INSERT INTO wallets_walletvalue (value, wallet_id, date) VALUES " + values
    print(sql)

    db.query(sql)
    db.commit()





