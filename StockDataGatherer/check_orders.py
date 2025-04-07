import datetime
from decimal import Decimal

from dbConn import db
import os
from dotenv import load_dotenv
import fmpsdk
from constants import symbols_list

load_dotenv()
apikey = os.environ.get("API_KEY")

def check_orders():
    stocks = fmpsdk.quote(apikey=apikey, symbol=symbols_list)

    stock_prices = dict()
    for stock in stocks:
        stock_prices[stock['symbol']] = stock['price']

    sql = "SELECT * FROM wallets_order"
    c = db.cursor()
    c.execute(sql)
    rows = c.fetchall()

    for row in rows:
        print(row)
        print(stock_prices[row[2]])
        print(row[1])
        print(row[3])
        print(row[4])

        if(row[1] == "buy"):
            if(stock_prices[row[2]] <= row[4]):
                total_price = Decimal(stock_prices[row[2]]) * row[3]
                sql = f"""INSERT INTO wallets_purchase 
    (symbol, quantity_purchased, quantity_available, price_per_share, 
    total_price, date, wallet_id) 
    VALUES (
    '{row[2]}',{row[3]},{row[3]},{stock_prices[row[2]]},
    {total_price},{datetime.datetime.now()},{row[5]}
    )"""
                print(sql)
                c.execute(sql)
                sql = f"UPDATE wallets_wallet SET balance = balance - {total_price} WHERE id = {row[5]}"
                c.execute(sql)
                sql = f"DELETE FROM wallets_order WHERE id = {row[0]}"
                c.execute(sql)

                sql = f"SELECT * FROM wallets_share WHERE wallet_id = {row[5]} and symbol = '{row[2]}'"
                c.execute(sql)
                rows = c.fetchall()
                print("HERE: " + len(rows))
                if(len(rows) == 0):
                    sql = f"INSERT INTO wallets_share (symbol, wallet_id, quantity) VALUES ('{row[2]}', {row[5]}, {row[3]})"
                    c.execute(sql)
                else:
                    sql = f"UPDATE wallets_share SET quantity = quantity + {row[3]} WHERE wallet_id = {row[5]} and symbol = '{row[2]}'"
                    c.execute(sql)
        else:
            if(stock_prices[row[2]] >= row[4]):
                total_price = Decimal(stock_prices[row[2]]) * row[3]
                sql = f"""SELECT id, quantity_available, price_per_share, date
from wallets_purchase 
WHERE wallet_id = {row[5]} AND symbol = '{row[2]}' and quantity_available > 0
ORDER BY date"""
                c.execute(sql)
                purchase_rows = c.fetchall()
                for purchase in purchase_rows:
                    print(purchase)

                # sql = f"""INSERT INTO wallets_sale
                #         (symbol, quantity_sold, price_per_share, total_price, date, profit, wallet_id)
                #         VALUES (
                #         {row[2]},{row[3]},{stock_prices[row[2]]},{total_price}, {datetime.datetime.now()},
                #         )
                #     """

check_orders()