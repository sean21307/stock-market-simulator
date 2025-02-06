import time

from selenium import webdriver
from selenium.common import NoSuchElementException
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("https://www.cnbc.com/nasdaq-100/")

time.sleep(3)

stock_symbols = []

table = driver.find_element(By.CLASS_NAME, "BasicTable-table")

for row in table.find_elements(By.TAG_NAME,'tr'):
    try:
        stock_symbols.append([
            row.find_element(By.CLASS_NAME,"BasicTable-symbol").text,
            row.find_element(By.CLASS_NAME, "BasicTable-name").text
        ])
    except NoSuchElementException:
        print("no such element")

with open("stock_ticker_constants.txt", "w") as txt_file:
    for line in stock_symbols:
        txt_file.write(line[0] + "," + line[1] + "\n")