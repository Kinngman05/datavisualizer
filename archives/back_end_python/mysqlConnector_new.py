#!/usr/bin/python3
import mysql.connector
from mysql.connector import errorcode
import mysqlQueryBuilder
import logging
from re import finditer
import os
import sys
import errors

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


class mysqlConnector():

    """
    This class is used to connect to the mysql database and perform basic mysql processes.
    It supports CREATE,USE,INSERT,UPDATE,DELETE,SELECT,DROP,PROCEDURE AND TRIGGER functionalities.
    It supports only WHERE condition as of now(ONLY ONE VALUE CAN BEW MATCHED)
    Check if you must use == or is for comparing the datatypes for assert in the functions
    """

    def __init__(self, **kwargs):
        """
        Takes an argument called "mysql_connection"(which must be set to true)
        and "connection" which holds the mysql.connector object to reuse an already
        existing connection or takes a dictionary of elements to create a new connection.
        """
        try:
            if(kwargs["mysql_connection"]):
                logging.info("Using an already existing connection.")
                self.mysqlConnection = kwargs["connection"]
                self.cursor = self.mysqlConnection.cursor(dictionary=True)
                logging.info("Connection successful")
        except KeyError:
            logging.info("Creating a new connection with arguments")
            logging.debug("The arguments are:"+str(kwargs))
            self.mysqlConnection = mysql.connector.connect(**kwargs)
            self.cursor = self.mysqlConnection.cursor(dictionary=True)
            logging.info("Connection successful")
        except mysql.connector.Error as err:
            logging.critical("Mysql connector error Error No:%4d:%s" %
                             (err.errno, str(err.msg)))
            if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
                logging.critical("Access was denied.")
            elif err.errno == errorcode.ER_BAD_DB_ERROR:
                logging.critical("Database does not exist.")
            elif err.errno == errorcode.ER_BAD_FIELD_ERROR:
                logging.critical("Invalid field.")
            elif err.errno == errorcode.ER_BAD_TABLE_ERROR:
                logging.critical("Table does not exist.")
            else:
                logging.critical(str(err.msg))
        except Exception as e:
            logging.critical("Error in connecting to the database:"+str(e))
            errors.UserDefinedError("Error please check the logs!")

    def _getConnectionId(self):
        return self.mysqlConnection.connection_id

    def _getConnection(self):
        """
        Return the current connection
        """
        return self.mysqlConnection

    def _getCursor(self):
        """
        Return the current cursor
        """
        return self.cursor

    def convertToUsableData(self, dataList):
        assert type(dataList) is list
        usableList = []
        logging.debug("The input dataList is:"+str(dataList))
        for aResponse in dataList:
            usableDict = {}
            for key in aResponse:
                usableDict[key] = str(aResponse[key])
            usableList.append(usableDict)
        logging.debug("Usable data is:"+str(usableList))
        return usableList

    def executeQuery(self, query=None, raiseExternally=False):
        """
        Execute a query.
        Write the part for raiseExternally part
        ER_BAD_DB_ERROR is db missing
        """
        logging.debug("Calling executeQuery")
        # if(query and raiseExternally): Write code for this
        if(query):
            try:
                logging.debug(
                    "Connection id "+str(self._getConnectionId())+",the query is:"+query)
                self.cursor.execute(query)
            except mysql.connector.ProgrammingError as err:
                if err.errno == errorcode.ER_PARSE_ERROR:
                    errors.UserDefinedError(
                        "ERROR IN THE SYNTAX {}".format(str(err)))
                elif err.errno == errorcode.ER_BAD_DB_ERROR:
                    raise errors.UnknownDatabaseError()
                else:
                    errors.NonCriticalError(
                        "MYSQL ERROR:{},{}".format(err, err.errno))
            except Exception as e:
                errors.UserDefinedError(
                    "Error not handeled!:{}:{}".format(str(e.__class__), str(e)))
        else:
            logging.debug("executeQuery called with no arguments")

    def execute(self,header,data):
        print("execute:")
        print(header,data)
        # arg1=header["REQUEST_TYPE"]
        # arg2=header["DATABASE"]
        # arg3=header["TABLE_NAME"]
        # print(arg1,arg2,arg3)
        # x=[]
        # x.extend([arg1,arg2,arg3])
        # x=list(filter(None,x))
        # print(x)
        obj=mysqlQueryBuilder.queryBuilder(header,**data)
        query=obj.buildQuery()
        print(query)

        # print(header["REQUEST_TYPE"])

    def commitChanges(self):
        """
        Commits the changes made!
        """
        logging.warning("COMMITTING CHANGES TO DATABASE.")
        self.mysqlConnection.commit()

    def closeConnection(self):
        """
        This is still under development as its giving me errors when using this, please do not use this method.
        """
        self.cursor.close()
        self.mysqlConnection.close()


if __name__ == "__main__":
    print("No point running this!")
else:
    pass
