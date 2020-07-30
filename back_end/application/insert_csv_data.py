#!/usr/bin/python3

import pandas as pd


class csvHandler():

    def __init__(self, file_path):
        self.file_path = file_path

    def convertMonToInt(self, month):
        if(month == "Jul"):
            return "07"
        elif(month == "Aug"):
            return "08"
        elif(month == "Sep"):
            return "09"
        elif(month == "Oct"):
            return "10"
        elif(month == "Nov"):
            return "11"
        elif(month == "Dec"):
            return "12"
        elif(month == "Jan"):
            return "01"
        elif(month == "Feb"):
            return "02"
        elif(month == "Mar"):
            return "03"
        elif(month == "Apr"):
            return "04"
        elif(month == "May"):
            return "05"
        elif(month == "Jun"):
            return "06"
        else:
            exit(0)

    def convertDate(self, date):
        dd, mm, yy = date.split("-")
        return yy+"-"+self.convertMonToInt(mm)+"-"+dd

    def get_querys(self):
        data = pd.read_csv(self.file_path)
        _DATABASE_NAME = "stocks"
        _TABLE_NAME = "raw_data"
        _REQUEST_TYPE = "insert"
        before = ('{"HEADER":{"DATABASE":"%s","TABLE_NAME":"%s","REQUEST_TYPE":"%s"},"DATA":{"FIELDS":{' % (
            _DATABASE_NAME, _TABLE_NAME, _REQUEST_TYPE))
        after = '}, "SET": null, "WHERE": null}, "FOOTER": {"DATA ABOUT THE REQUEST": "ins_mock_data", "COMMENT": "dbms_project", "DEP": null, "UPDATE": null}}'
        allData = []
        for index, row in data.iterrows():
            if(index in [0]):
                continue
            allData.append(before+f'"symbol":"{row["Symbol"]}","series":"{row["Series"]}","date":"{self.convertDate(row["Date"])}","prev_close":"{row["Prev Close"]}","open":"{row["Open Price"]}","high":"{row["High Price"]}","low":"{row["Low Price"]}","close":"{row["Close Price"]}","last_price":"{row["Last Price"]}","VWAP":"{row["Average Price"]}","total_traded_qty":"{row["Total Traded Quantity"]}","turnover":"{row["Turnover"]}","no_of_trades":"{row["No. of Trades"]}","deliverable_quantity":"{row["Deliverable Qty"]}","percent_calc":"{row["% Dly Qt to Traded Qty"]}"'+after)
            # allData.append(before+f'"date":"{convertDate(row["Date"])}","prev_close":"{row["Prev Close"]}","close":"{row["Close Price"]}"'+after)
        return allData
