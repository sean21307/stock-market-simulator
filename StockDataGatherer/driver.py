import time
from datetime import datetime

import update_wallets

import os
from dotenv import load_dotenv

from StockDataGatherer import check_orders

load_dotenv()
apikey = os.environ.get("API_KEY")

holidays_2025 = {
      "New Year's Day": "2025-01-01",
      "National Day of Mourning": "2025-01-09",
      "Martin Luther King, Jr. Day": "2025-01-20",
      "Washington's Birthday": "2025-02-17",
      "Good Friday": "2025-04-18",
      "Memorial Day": "2025-05-26",
      "Juneteenth": "2025-06-19",
      "Independence Day": "2025-07-04",
      "Labor Day": "2025-09-01",
      "Thanksgiving Day": "2025-11-27",
      "Christmas": "2025-12-25"
    },
while True:
    if holidays_2025.__contains__(datetime.today().strftime("%Y-%m-%d")) or datetime.today().weekday() >= 5:
        time.sleep(60 * 60 * 24)
    else:
        current_hour = datetime.today().hour
        if current_hour < 9 or current_hour > 17:
            hours_until_open = abs(9 - current_hour)
            time.sleep(60 * 60 * hours_until_open)
        else:
            try:
                update_wallets.update_wallets()
                check_orders.check_orders()
            except Exception as ex:
                print(ex)
            finally:
                time.sleep(60 * 15)
