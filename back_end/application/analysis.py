#!/usr/bin/python3
import database as db
import pandas as pd
import datetime
import json


class Analysis:

    def __init__(self, file_path, process=None):
        self.data = pd.read_csv(file_path)
        self.process = process

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

    def analyze_vwap(self, list_of_days):
        x = list(map(lambda x: self.convertDate(x), self.data['Date']))
        for number_of_days in list_of_days:
            # print("Running for", number_of_days)
            # print(x)
            for element in x:
                # print("Working?--------------YES!")
                query = ('''{"HEADER":{"DATABASE":"stocks","TABLE_NAME":"raw_data","REQUEST_TYPE":"select"},"DATA":{"FIELDS":["symbol","vwap"],"SET":null,"WHERE":{"__QUERY__":"symbol='%s' AND `date`<= '%s' ORDER BY `date` DESC LIMIT %d"}},"FOOTER":{"DATA ABOUT THE REQUEST":"N","COMMENT":"N","DEP":null,"UPDATE":null}}''' % (
                    self.data['Symbol'][0], element, number_of_days))
                self.process.input(query, 0)
                result = self.process.processRequest()
                result = pd.DataFrame(result)
                # print(result.head())
                try:
                    result.vwap = result.vwap.astype(float)
                except AttributeError as e:
                    pass
                if(result.shape[0] < number_of_days):
                    # print(element, " dosent have enough data.")
                    pass
                else:
                    fields = {}
                    fields.update(
                        {f"vwap_{number_of_days}": result.mean().round(2)[0]})
                    # print("fields:", fields)
                    where = {}
                    where.update({"symbol": self.data['Symbol'][0]})
                    where.update({"date": element})
                    # print(element, result.mean().round(2)[0])
                    query = ('''{"HEADER":{"DATABASE":"stocks","TABLE_NAME":"analysis","REQUEST_TYPE":"update"},"DATA":{"FIELDS":null,"SET":%s,"WHERE":%s},"FOOTER":{"DATA ABOUT THE REQUEST":"N","COMMENT":"N","DEP":null,"UPDATE":null}}''' % (
                        json.dumps(fields), json.dumps(where)))
                    # print(query)
                    self.process.input(query, 0)
                    self.process.processRequest()
