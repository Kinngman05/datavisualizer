#!/usr/bin/python3
import sys
import json
import mysqlConnector_new as sql
import analytics
import logging
import os


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
    filename=PATH+'railApplication.log',
    format='%(asctime)s.%(msecs)-3d:%(filename)s:%(funcName)s:%(levelname)s:%(lineno)d:%(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
    level=logging.DEBUG
)


class main:
    '''
    1)GET A BETTER NAME FOR THE CLASS
    2)WRITE BETTER DOCUMENTATION AS YOU GO
    4)PLEASE MAKE SURE YOU PASS 'null' AND NOT AN EMPTY LIST OR A DICTIONARY
    '''
    # Constructor which decodes the incoming json data

    def __init__(self, jsonData=None, levelNumber=None):
        logging.info("Constructor of class __name__:{} was called in levelNumber:{}".format(
            __name__, levelNumber))
        if(jsonData == None and levelNumber == None):
            logging.info("No parameters passed at object creation")
        elif(jsonData != None and levelNumber != None):
            self.input(jsonData, levelNumber)
        else:
            logging.critical("Input parameters error!")

    def input(self, jsonData, levelNumber):
        # The following piece of code is used to convert the data to dict format if it inst already in that format
        try:  # Checking if the input data is of string type
            logging.debug(
                "Input data is of string type, converting into dict format")
            self.jsonString = json.loads(str(jsonData))
            logging.debug("SUCCESS")
        except json.decoder.JSONDecodeError:  # Checking of the input data is of dict type, this happens only when the class create an instance of itself!
            logging.debug("Input data is of dict type, no changes made")
            self.jsonString = jsonData
            logging.debug("SUCCESS")

        logging.debug("The jsonString is of datatype:" +
                      str(type(self.jsonString)))

        # logging.debug(str(self.jsonString))
        logging.debug("Input data is:"+str(self.jsonString))

        # assert type(self.jsonString) is dict
        logging.debug("The jsonString is of datatype:" +
                      str(type(self.jsonString)))

        self.levelNumber = levelNumber

        self.footer = self.jsonString["FOOTER"]  # Gets the footer
        self.updateList = self.footer["UPDATE"]  # update name within header
        self.conditionList = self.footer["DEP"]  # dep name within header

    # Establishes a connection between the script and the mysql database
    def setConnection(self, connection=None):
        """
        Sets the connection the database
        """
        if(connection == None):
            logging.info("Creating a new connection to the database")
            self.mysqlConnection = sql.mysqlConnector(
                option_files=(PATH+".config/mysql.cnf"))
            logging.info("Connection successful")
        else:
            logging.info(
                "This connection in inherited from the calling function/script.")
            self.mysqlConnection = connection
        try:
            self.mysqlConnection.use(self.database)
        except AttributeError:
            logging.debug(
                "Failed to connect to the database, this is when you are using persistent connections")

    def processRequest(self):
        """
        Process the request sent by the front end/calling script.
        """
        logging.info("Processing request")
        self.conditionFlag = False
        # cannot test for len(self.conditionList) == 0 i.e when there is a empty list passed, raises TypeError
        if(self.conditionList != None):
            for element in self.conditionList:
                logging.info(
                    "LevelNumber: {} - Creating a new sub process for conditionList with:".format(self.levelNumber)+str(element))
                subProcess = main(element, self.levelNumber + 1)
                subProcess.setConnection(self.mysqlConnection)
                ###################
                # The following line creates a new instance of the object which is of SELECT type and returns data
                # from the database of that select statement
                # If the condition is true then a list of data is returned, else None type is returned and the if case
                # is not executed.
                ###################
                if subProcess.processRequest():  # If select returns a data if is executed, if None is returned then else is executed
                    logging.info("The condition flag is being set to True")
                    self.conditionFlag = True
                else:
                    logging.info("The condition flag is being set to False")
                    self.conditionFlag = False
                    logging.warning(
                        "THIS CURRENT DEPENDICY HAS FAILED!!! ABORTING TRANSACTION")
                    break
        else:
            logging.info("conditionList is null")
        # cannot test for len(self.conditionList) == 0 i.e when there is a empty list passed, raises TypeError
        if(self.conditionList == None or self.conditionFlag == True):
            self.mysqlConnection.execute(self.jsonString["HEADER"]["REQUEST_TYPE"],self.jsonString["DATA"])
            if(self.updateList):
                try:
                    for anObject in self.updateList:
                        logging.info("LevelNumber: {} - Creating a new sub process for updateList with:".format(
                            self.levelNumber)+str(anObject))
                        subProcess = main(anObject, self.levelNumber + 1)
                        subProcess.setConnection(self.mysqlConnection)
                        subProcess.processRequest()
                except TypeError:
                    logging.critical(
                        "TypeError was raised when processing a condition expected a dict type got {}".format(type(anObject)))
                    exit(0)
                except BaseException as e:
                    logging.info("Exception Raised:"+str(e))
                    exit(0)
            if(self.levelNumber == 0):
                self.mysqlConnection.commitChanges()
        else:
            logging.critical("Queries condition has not been executed")

    # def generateAnalytics(self):  # Write # logger function for this
    #     """
    #     Should work only when there it is of the type 'update' or 'insert'
    #     """
    #     if(self.conditionFlag == False):
    #         return
    #     else:
    #         try:
    #             genAnalytics = analytics.analytics(
    #                 self.mysqlConnection, **self.analyticsArguments)
    #             genAnalytics.generateAnalytics(self.runCondition)
    #         except AttributeError as err:
    #             logging.warning(
    #                 "This may occur when it is a SELECT statement. ERROR:"+str(err))
    #     return

    def closeConnection(self):
        self.mysqlConnection.closeConnection()

if __name__ == '__main__':
    logging.info("Start of database.py")
    if(len(sys.argv) == 2):
        logging.debug("The path is:"+PATH)
        process = main(sys.argv[1], 0)
        process.setConnection()
        process.processRequest()
        # process.generateAnalytics()
        process.closeConnection()
    else:
        logging.critical("Invalid number of arguments was passed the script.")
        logging.info(sys.argv)
    logging.info("End of database.py")
else:
    pass