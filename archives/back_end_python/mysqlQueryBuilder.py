#!/usr/bin/python3
import mysql.connector
from mysql.connector import errorcode
import logging
from re import finditer
import os
import sys
import errors

# I am using "".join() over += as join is a superior and faster method of concatinating strings

PATH = None
pathToExeFromCurDir = sys.argv[0]
current_directory = os.getcwd()
if(pathToExeFromCurDir.startswith("/")):
    PATH = pathToExeFromCurDir
elif(pathToExeFromCurDir.startswith(".")):
    PATH = current_directory + pathToExeFromCurDir[1:]
else:
    PATH = current_directory + "/" + pathToExeFromCurDir
PATH = PATH.rsplit("/",1)[0] + "/"


logging.basicConfig(
    filename= PATH+'railApplication.log',
    format='%(asctime)s.%(msecs)-3d:%(filename)s:%(funcName)s:%(levelname)s:%(lineno)d:%(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
    level=logging.DEBUG
)


TABLE_ATTRIBUTES       ='table_constrains'
INDEX_CONSTRAINTS      ='index_constrains'
FOREIGN_KEY_CONSTRAINTS='foreign_key'
PROCEDURE_PARAMETERS   ='parameters'
PROCEDURE_QUEIRES      ='queries'
TRIGGER_TIME           ='time'
TRIGGER_EVENT          ='event'
FOR_EACH               ='each'
TRIGGER_QUERIES        ='queries'
DB_NAME                ='database_name'
TABLE_NAME             ='name'
ATTRIBUTE_LIST         ='attributes'
FROM_LIST              ='name'
WHERE_LIST             ='where'
GROUP_BY_LIST          ='group_by'
HAVING_LIST            ='having'
ORDER_BY_LIST          ='order_by'
OFFSET_LIST            ='offset'
LIMIT_LIST             ='limit'

# CREATE=10
# USE   =11
# INSERT=12
# UPDATE=13
# ALTER =14
# DELETE=15
# DROP  =16

# DATABASE =20
# TABLE    =21
# PROCEDURE=22
# TRIGGER  =23

class queryBuilder():
    '''
    Okay so this does not support a "." being used as a name of a anything.
    So make sure you don't use it as a name, but to adderess names/attributes.
    '''
    #All methods of the class will return a string.

    def __init__(self, kind, *args, **kwargs):
        # logging.debug("Start of queryBuilder")
        # logging.debug("The kind is:"+str(kind))
        # logging.debug("The args is:"+str(args))
        # logging.debug("The kwargs is:"+str(kwargs))
        print("Start of queryBuilder")
        print("The kind is:"+str(kind))
        print("The args is:"+str(args))
        print("The kwargs is:"+str(kwargs))
        self.command = str(kind)
        self.args = args
        self.kwargs = kwargs
        self.query = []
        # print("self.query:",self.query)

    def _encloseWith(self, inputParameter, character="`",excluding=[],excludingWord=[]):        #Maybe you want to add a excludingSubstring parameter?
        logging.debug("The input to the function is:"+str(inputParameter)+" "+str(type(inputParameter)))
        if(type(inputParameter)==str):
            logging.debug("The input to the function is a string")
            logging.debug("The output from the function is:"+".".join(map(lambda x: x if ((x[0] == '`' and x[-1] == '`') or (x in excludingWord) or (any(item in excluding for item in x))) else (character+x+character),inputParameter.split("."))))
            return ".".join(map(lambda x: x if ((x[0] == '`' and x[-1] == '`') or (x in excludingWord) or (any(item in excluding for item in x))) else (character+x+character),inputParameter.split(".")))
        elif(type(inputParameter) in [int,float]):
            logging.debug("The input to the function is an integer or float")
            logging.debug("The output from the function is:"+str(inputParameter))
            return str(inputParameter)
        elif(type(inputParameter)==list):
            logging.debug("The input to the function is a list")
            retList=[]
            for element in inputParameter:
                retList.append(".".join(map(lambda x: x if ((x[0] == '`' and x[-1] == '`') or (x in excludingWord) or (any(item in excluding for item in x.split(" ")))) else (character+x+character),element.split("."))))
            logging.debug("The output from the function is:"+str(retList))
            return retList

    def _addBrackets(self,stringInput):
        return "(" + stringInput + ")"

    def mergeLastTwoElements(self,inputList):
        inputList[-2:]=["".join(inputList[-2:])]

    def buildQuery(self):
        self.query.append((self.command).upper())
        # print(self.query)
        if((self.command).upper()=="CREATE"):
            return self.create()
        elif((self.command).upper()=="USE"):
            return self.use()
        elif((self.command).upper()=="INSERT"):
            return self.insert()
        elif((self.command).upper()=="DELETE"):
            return self.delete()
        elif((self.command).upper()=="UPDATE"):
            return self.update()
        elif((self.command).upper()=="SELECT"):
            return self.select()
        elif((self.command).upper()=="DROP"):
            return self.drop()

    def _constructAttributes(self,datatype,test=True):            #Variable name does not make symantic sense but only logical sense
        if(datatype and test):
            return ",".join(map(lambda attributeName: " ".join([self._encloseWith(attributeName),datatype[attributeName]]),datatype))
        elif(not(test) and datatype):
            return list(map(lambda attributeName: " ".join([self._encloseWith(attributeName),datatype[attributeName]]),datatype))

    def _constructIndex(self,indices):
        if(indices):
            # print(indices)
            z=[]
            for y in indices:
                z.append(self._encloseWith(y[0]) if len(y)==1 else ",".join(self._encloseWith(y)))
            z=list(map(lambda a: "INDEX("+a+")",z))
            return z
        return []

    def _constructForeignKey(self, foreignKeys):
        # print(foreignKeys)
        if(foreignKeys):
            for foreignKey in foreignKeys:
                constraintName = foreignKey.pop("constraint_name",None)
                foreignTableName = foreignKey.pop("foreign_table_name",None)
                childAttribute = foreignKey.pop("child_attribute",None)
                parentAttribute = foreignKey.pop("parent_attribute",None)
                onUpdate = foreignKey.pop("on_update",None)
                onDelete = foreignKey.pop("on_delete",None)
                finalQuery=[]
                if(constraintName):
                    if("." in constraintName):
                        logging.error("The constraint has a '.' in it, this is not supported in this version.")
                    finalQuery.append("CONSTRAINT")
                    finalQuery.append(self._encloseWith(constraintName))
                finalQuery.append("FOREIGN KEY")
                localList = []
                for element in childAttribute:
                    localList.append(self._encloseWith(element))
                finalQuery.append(self._addBrackets(",".join(localList)))
                finalQuery.append("REFERENCES")
                finalQuery.append(self._encloseWith(foreignTableName))
                localList = []
                for element in parentAttribute:
                    localList.append(self._encloseWith(element))
                finalQuery.append(self._addBrackets(",".join(localList)))
                ###
                ### ON UPDATE AND ON DELETE CAN HAVE THE FOLLOWING VALUES [RESTRICT | CASCADE | SET NULL | NO ACTION | SET DEFAULT]
                ###
                if(onUpdate):
                    finalQuery.append("ON UPDATE")
                    finalQuery.append(onUpdate)
                if(onDelete):
                    finalQuery.append("ON DELETE")
                    finalQuery.append(onDelete)
                finalQuery=[" ".join(finalQuery)]
                return finalQuery
        return []

    def _constructParameters(self,parameterList):
        pass

    def _constructQueries(self,queries):
        pass


    def create(self):
        # self.query.extend(self.args[0:-1])
        # self.query.append(self._encloseWith(self.args[-1]))
        self.query.append(self.kwargs.pop("what"))
        self.query.append(self._encloseWith(self.kwargs.pop("object")))
        if(self.kwargs):   #You still need to do CREATE VIEW
            localList = []
            try:    #This block is for executing if its a 'CREATE TABLE'
                localList.extend(self._constructAttributes(self.kwargs.pop(TABLE_ATTRIBUTES),False))
                localList.extend(self._constructIndex(self.kwargs.pop(INDEX_CONSTRAINTS)))
                localList.extend(self._constructForeignKey(self.kwargs.pop(FOREIGN_KEY_CONSTRAINTS)))
                #Check if you are going to add partition on this
                localList=",".join(localList)
                self.query.append(self._addBrackets(localList))
            except KeyError:
                try:    #This block is for executing if its a 'CREATE PROCEDURE'                           ----- INCOMPLETE
                    # localList.extend(self._constructParameters(self.kwargs.pop(PROCEDURE_PARAMETERS)))
                    # localList.extend(self._constructQueries(self.kwargs.pop(PROCEDURE_QUEIRES)))
                    parameters=self.kwargs.pop(PROCEDURE_PARAMETERS)
                    parameters=",".join(parameters)
                    localList.append(self._addBrackets(parameters))
                    localList.append("BEGIN")
                    # localList.extend(self.kwargs.pop(PROCEDURE_QUEIRES))
                    queries=self.kwargs.pop(PROCEDURE_QUEIRES)
                    queries="".join(list(map(lambda y: y if y[-1]==";" else (y+";"),queries)))    #This is a use of python ternary(conditional) operator
                    localList.append(queries)
                    localList.append("END")
                    localList=" ".join(localList)
                    self.query.append(localList)
                    #Write the join function
                except KeyError:
                    try:
                        localList.append(self.kwargs.pop(TRIGGER_TIME))
                        localList.append(self.kwargs.pop(TRIGGER_EVENT))
                        localList.append("ON")
                        localList.append(".".join([self._encloseWith(self.kwargs.pop(DB_NAME)),self._encloseWith(self.kwargs.pop(TABLE_NAME))]))
                        localList.append((self.kwargs.pop(FOR_EACH)).upper())
                        # localList.append("FOR EACH ROW") #This can also be for each statement
                        localList.append("BEGIN")        #where clause can precede this I guess
                        queries=self.kwargs.pop(TRIGGER_QUERIES)
                        queries="".join(list(map(lambda y: y if y[-1]==";" else (y+";"),queries)))    #This is a use of python ternary(conditional) operator
                        localList.append(queries)
                        localList.append("END")
                        localList=" ".join(localList)
                        self.query.append(localList)
                    except KeyError:
                        print("Code for views is not yet defined")
                        pass # Write code for views
        self.query=" ".join(self.query)
        return self.query

    def use(self):
        self.query.extend(self.args)
        # print("-X-",self.query)
        self.query=" ".join(self.query)
        return self.query

    def insert(self):
        #Check to see if you will give the insert select and the insert on duplicate key update
        localList=[]
        self.query.append("INTO")
        self.query.append(self._encloseWith(self.args[-1]))
        # print(localList)
        self.query.append(self._addBrackets(",".join(self._encloseWith(list(self.kwargs.keys())))))
        self.query.append("VALUES")
        self.query.append(self._addBrackets(",".join(self._encloseWith(list(self.kwargs.values()),"'"))))
        # self.query.append(self.kwargs.values())
        self.query.append(" ".join(localList))
        self.query=" ".join(self.query)
        return self.query

    def delete(self):
        self.query.append("FROM")
        self.query.append(self.kwargs.pop('name'))
        localList=[]
        whereClause=self.kwargs.pop(WHERE_LIST,None)
        if(whereClause):
            localList.append("WHERE")
            localList.append(self._buildWhereClause(whereClause))    #Supports only and for now.
        havingClause=self.kwargs.pop(HAVING_LIST,None)
        if(havingClause):
            localList.append("HAVING")                               #This is still incomplete
            pass
        "".join(localList)
        print(self.query)
        print(localList)

    def update(self):
        pass

    def _buildWhereClause(self,whereClause):
        # print("In build where clause")
        localList=[]
        for key in whereClause:
            print(self._encloseWith(key),self._encloseWith(whereClause[key],character="'"))
            # if('NULL' == (whereClause[key]).upper()):
            #         localList.append(" ".join([self._encloseWith(key),"IS",whereClause[key]]))
            #         continue
            try:
                if('NULL' == (whereClause[key]).upper()):
                    localList.append(" ".join([self._encloseWith(key),"IS",whereClause[key]]))
                    continue
            except AttributeError:
                localList.append("".join([self._encloseWith(key),"=",self._encloseWith(whereClause[key],character="'")]))
            else:
                print(self._encloseWith(key),"=",self._encloseWith(whereClause[key],character="'"))
                localList.append("".join([self._encloseWith(key),"=",self._encloseWith(whereClause[key],character="'")]))
        return " AND ".join(localList)                        #This can also use an OR instead of an AND

    def select(self):
        #Make sure you take care of LIKE, BETWEEN and the rest of the keywords that can be used here, also remember IS NULL
        #where (a,b) IN (select a,b from x) and AS will not be supported, write a view instead!
        localList=[]
        #Aggregate functions don't work correctly if specifired with a mysql keyword as attribute
        #Take caution '`table`.*' is VALID!
        localList.append(",".join(self._encloseWith(self.kwargs.pop(ATTRIBUTE_LIST),excluding=["*","+","-","/","("])))
        localList.append("FROM")
        localList.append(",".join(self._encloseWith(self.kwargs.pop(FROM_LIST)))) #You can create a function to add an alias
        whereClause=self.kwargs.pop(WHERE_LIST,None)
        # print("The where clause is:",whereClause)
        if(whereClause):
            localList.append("WHERE")
            localList.append(self._buildWhereClause(whereClause))    #Supports only and for now.
        groupByClause=self.kwargs.pop(GROUP_BY_LIST,None)
        if(groupByClause):
            localList.append("GROUP BY")
            localList.append(",".join(self._encloseWith(groupByClause)))
        havingClause=self.kwargs.pop(HAVING_LIST,None)
        if(havingClause):
            localList.append("HAVING")                               #This is still incomplete
            pass
        orderByClause=self.kwargs.pop(ORDER_BY_LIST,None)
        if(orderByClause):
            localList.append("ORDER BY")
            localList.append(",".join(self._encloseWith(orderByClause,excluding=["DESC","ASC"])))
        limitClause=self.kwargs.pop(LIMIT_LIST,None)
        if(limitClause):
            localList.append("LIMIT")
            localList.append(str(limitClause))
        offsetClause=self.kwargs.pop(OFFSET_LIST,None)
        if(offsetClause):
            localList.append("OFFSET")
            localList.append(str(offsetClause))
        # print(localList)
        self.query.append(" ".join(localList))
        self.query=" ".join(self.query)
        return self.query

    def drop(self):
        self.query.extend(self.args[0:-1])
        self.query.append(self._encloseWith(self.args[-1]))
        self.query=" ".join(self.query)
        return self.query


if __name__ == "__main__":
    print("No point running this!")
else:
    pass
