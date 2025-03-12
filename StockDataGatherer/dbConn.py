import os

import MySQLdb
from dotenv import load_dotenv
from pathlib import Path

dotenv_path = Path('.env')
load_dotenv(dotenv_path=dotenv_path)

host = os.getenv("DB_HOST")
user = os.getenv("DB_USERNAME")
password = os.getenv("DB_PASS")
database = os.getenv("DB_NAME")
port = int(os.getenv("DB_PORT"))

db = MySQLdb.connect(host=host, user=user, password=password, database=database, port=port)