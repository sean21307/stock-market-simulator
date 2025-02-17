import time

from yfinance import Market

import UpdateDB
market = Market('NMS')
numOfCycles = 0;
while True:
    # comment out the following if statement if you wish
    # to update db while market is closed
    if(market.status.get('status') == 'closed'):
        print("MARKET CLOSED, TRYING AGAIN IN 1 HOUR")
        time.sleep(3600)
        continue
    UpdateDB.updateDB()

    print("" + str(numOfCycles) + " 1m cycle(s) complete")
