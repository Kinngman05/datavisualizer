#!/usr/bin/python3

import pandas as pd
import numpy as np
import logging
import sys
import os
from query_builder import query_builder

PATH = None
pathToExeFromCurDir = sys.argv[0]
current_directory = os.getcwd()
if(pathToExeFromCurDir.startswith("/")):
    PATH = pathToExeFromCurDir
elif(pathToExeFromCurDir.startswith(".")):
    PATH = current_directory + pathToExeFromCurDir[1:]
else:
    PATH = current_directory + "/" + pathToExeFromCurDir
PATH = PATH.rsplit("/", 1)[0] + "/"

logging.basicConfig(
    filename=PATH+'application.log',
    format='%(asctime)s.%(msecs)-3d:%(filename)s:%(funcName)s:%(levelname)s:%(lineno)d:%(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
    level=logging.DEBUG
)
query = query_builder()

class csvHandler():

    def __init__(self, file_path, database, table, csvToDbMap, types, code):
        self.file_path = file_path
        self.database = database
        self.table = table
        self.mapper = csvToDbMap
        self.dtypes = types
        self.code = code
        self.analytics = pd.DataFrame()
        # print(types)

    def convertMonToInt(self, month):
        if(month == "jul"):
            return "07"
        elif(month == "aug"):
            return "08"
        elif(month == "sep"):
            return "09"
        elif(month == "oct"):
            return "10"
        elif(month == "nov"):
            return "11"
        elif(month == "dec"):
            return "12"
        elif(month == "jan"):
            return "01"
        elif(month == "feb"):
            return "02"
        elif(month == "mar"):
            return "03"
        elif(month == "apr"):
            return "04"
        elif(month == "may"):
            return "05"
        elif(month == "jun"):
            return "06"

    def convertDate(self, date):
        # Write an arssertion statement here
        dd, mm, yy = date.split("-")
        return yy+"-"+self.convertMonToInt(mm.lower())+"-"+dd

    def check_datatypes(self,data):
        columns = data.columns
        print("The columns are:" + str(columns))
        logging.debug("The columns are:" + str(columns))
        for column in columns:
            for dtype in self.dtypes:
                if(dtype['Field'].lower() == column.lower()):
                    if(dtype['Type'].lower() == 'date'):
                        data[column] = np.vectorize(self.convertDate)(data[column])
                        break
        print("The data after datatype conversion is:" + str(data.head().to_dict()))
        logging.debug("The data after datatype conversion is:" + str(data.head().to_dict()))
        return data

    def get_querys(self):
        data = pd.read_csv(self.file_path)
        data = data.loc[:, ~data.columns.str.match("Unnamed")]  # Remove any Unnamed columns
        data = data.replace(np.nan, "NULL")
        data = data.rename(columns=self.mapper)
        print(data.head())
        col_name = self.mapper.values()
        data = self.check_datatypes(data)
        query.set_database(self.database)
        query.set_table(self.table)
        query.set_req_type("insert")
        allData = []
        for _, row in data.iterrows():
            query.set_fields(row.to_dict())
            query.build()
            allData.append(query.get_query())
        print(allData[:5])
        return allData

    def generate_analytics(self):
        pass


if __name__ == "__main__":
    #Test code
    process = csvHandler("~/Downloads/30-08-2019-TO-28-08-2020TATAELXSIEQN.csv", "stocks", "equity", {"Symbol":"symbol","Series":"series","Date":"date","Prev Close":"prev_close","Open Price":"open","High Price":"high","Low Price":"low","Last Price":"last_price","Close Price":"close","Average Price":"vwap","Total Traded Quantity":"total_traded_qty","Turnover":"turnover","No. of Trades":"no_of_trades","Deliverable Qty":"deliverable quantity","% Dly Qt to Traded Qty":"percecnt_calc"},[{'Field': 'symbol', 'Type': 'varchar(10)', 'Null': 'NO', 'Key': 'PRI', 'Default': None, 'Extra': ''}, {'Field': 'series', 'Type': 'char(2)', 'Null': 'NO', 'Key': '', 'Default': None, 'Extra': ''}, {'Field': 'date', 'Type': 'date', 'Null': 'NO', 'Key': 'PRI', 'Default': None, 'Extra': ''}, {'Field': 'prev_close', 'Type': 'decimal(12,2)', 'Null': 'NO', 'Key': '', 'Default': None, 'Extra': ''}, {'Field': 'open', 'Type': 'decimal(12,2)', 'Null': 'NO', 'Key': '', 'Default': None, 'Extra': ''}, {'Field': 'high', 'Type': 'decimal(12,2)', 'Null': 'NO', 'Key': '', 'Default': None, 'Extra': ''}, {'Field': 'low', 'Type': 'decimal(12,2)', 'Null': 'NO', 'Key': '', 'Default': None, 'Extra': ''}, {'Field': 'last_price', 'Type': 'decimal(12,2)', 'Null': 'NO', 'Key': '', 'Default': None, 'Extra': ''}, {'Field': 'close', 'Type': 'decimal(12,2)', 'Null': 'NO', 'Key': '', 'Default': None, 'Extra': ''}, {'Field': 'vwap', 'Type': 'decimal(12,2)', 'Null': 'NO', 'Key': '', 'Default': None, 'Extra': ''}, {'Field': 'total_traded_qty', 'Type': 'int(11)', 'Null': 'NO', 'Key': '', 'Default': None, 'Extra': ''}, {'Field': 'turnover', 'Type': 'decimal(15,2)', 'Null': 'YES', 'Key': '', 'Default': None, 'Extra': ''}, {'Field': 'no_of_trades', 'Type': 'int(11)', 'Null': 'YES', 'Key': '', 'Default': None, 'Extra': ''}, {'Field': 'deliverable_quantity', 'Type': 'int(11)', 'Null': 'YES', 'Key': '', 'Default': None, 'Extra': ''}, {'Field': 'percent_calc', 'Type': 'decimal(6,2)', 'Null': 'YES', 'Key': '', 'Default': None, 'Extra': ''}],None)
    data = process.get_querys()
    pass