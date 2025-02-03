# importing required libraries
import mysql.connector

dataBase = mysql.connector.connect(
    host="localhost",
    user="user",
    passwd="gfg"
)

# preparing a cursor object
cursorObject = dataBase.cursor()

# creating database
cursorObject.execute("CREATE DATABASE geeks4geeks")