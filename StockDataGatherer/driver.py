import time

from yfinance import Market

import UpdateDB
market = Market('NMS')

while True:
    if(market.status.get('status') == 'closed'):
        print("MARKET CLOSED, TRYING AGAIN IN 1 HOUR")
        time.sleep(3600)
    UpdateDB.updateDB()
    time.sleep(300)