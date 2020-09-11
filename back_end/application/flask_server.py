#!/usr/bin/python3
import database as db
import json
from flask import Flask, render_template, request
from flask_socketio import SocketIO
from flask_socketio import send, emit
from flask_cors import CORS, cross_origin
from flask import flash, request, redirect, url_for
from werkzeug.utils import secure_filename
from pandas import read_csv
from datetime import date

import insert_csv_data as csv
import analysis

import os
import sys
import logging

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

UPLOAD_FOLDER = PATH.rsplit("/", 3)[0] + "/file_dumps/"
ALLOWED_EXTENSIONS = {'csv'}

#
# New untested code added here
#

app = Flask(__name__)
cors = CORS(app)
app.config['SECRET_KEY'] = 'secret!'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
socketio = SocketIO(app, cors_allowed_origins="*")

print("Connecting to the database")
process = db.main()
process.setConnection()
print("Connection successful")


@socketio.on('connect')
def handle_my_custom_event():
    if request.args.get('fail'):
        logging.warning(f"User {request.remote_addr} connection failed")
        return False
    print(request.remote_addr, "CONNECTED!")
    send("Hello from flask server")


@socketio.on('query')
def process_query(query):
    logging.debug('received query: ' + str(query) +
                  "query type:" + str(type(query)))
    process.input(query, 0)
    result = process.processRequest()
    if(result):
        logging.debug("The result is:"+ str(result))
        emit('result', str(json.dumps(result)))
    else:
        logging.warning("No result sent back from the database")


@socketio.on('validate_user')
def validate_user(credentials):
    logging.debug("Recieved credentials:", credentials)
    process.input(credentials, 0)
    result = process.processRequest()
    if(result):
        emit('response', str(json.dumps({"result": True})))
    else:
        emit('response', str(json.dumps({"result": False})))


@socketio.on('message')
def handle_message(message):
    logging.info(f"Message from {request.remote_addr}:{message}")
    print(f"Message from {request.remote_addr}:{message}")


@socketio.on('settings')
def database_settings(data):
    try:
        with open(".config/database.json") as cnfFile:
            database = json.load(cnfFile)
            # print(database)
            data = json.loads(data)
            if(data['type'] == 'request'):
                database['result'] = True
                emit('result', str(json.dumps(database)))
            elif(data['type'] == 'update'):
                pass
    except FileNotFoundError as e:
        logging.error("could not open database.json")
        emit('result', str(json.dumps({"result": False})))


@socketio.on_error_default  # handles all namespaces without an explicit error handler
def default_error_handler(e):
    print("ERROR ENCOUNTERED IN SERVER:", e)
    print("args:" + str(request.event))


@socketio.on('disconnect')
def handle_disconnect():
    print(f"{request.remote_addr} disconnected.")


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#
# Write logging functions for this
#


@app.route('/uploadcsv', methods=['GET','POST'])  # Probably need to remove GET
@cross_origin()
def upload_file():
    logging.info(f"Upload request from {request.remote_addr}")
    if request.method == 'POST':
        # check if the post request has the file part
        # print(request.files)
        if 'file' not in request.files:
            logging.warning("file not in request.files")
            # flash('No file part')
            return json.dumps({"status": False, "error": "Error in upload to server!"})
            # return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            logging.warning('Invalid file name!')
            # flash('No selected file')
            return json.dumps({"status": False, "error": "Invalid file name!"})
            # return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            logging.info(f"Saving file {filename} at {app.config['UPLOAD_FOLDER']}")
            file.save(file_path)
            database_name = request.args.get('database')
            table_name = request.args.get('table')
            # mapper = request.args.get('mapper')
            with open("analysis_code.json","r") as mapper_file:
                print(f"UPLOAD TO {database_name}.{table_name}")
                data = json.load(mapper_file)
                try:
                    database = data[database_name]
                    table = database[table_name]
                    mapper = table['mapper']
                    code = table['code']
                    query = '{"HEADER":{"DATABASE":"'+database_name+'","TABLE_NAME":"'+table_name+'","REQUEST_TYPE":"describe"},"DATA":{"FIELDS":null,"SET":null,"WHERE":null},"FOOTER":{"DATA ABOUT THE REQUEST":null,"COMMENT":null,"DEP":null,"UPDATE":null}}'
                    process.input(query,0)
                    dtypes = process.processRequest()
                    csv_file = csv.csvHandler(file_path,database_name,table_name,mapper,dtypes,code)
                    csv_file.generate_analytics()
                    querys = csv_file.get_querys()
                    # print(querys)
                    for query in querys:
                        process.input(query, 0)
                        result = process.processRequest()
                    return json.dumps({"status": True, "message": f"{file.filename}"})
                except KeyError as err:
                    print("The ERROR is:",err)
                    return json.dumps({"status": False, "error": f"Please save mapper for {file.filename}"})
        else:
            return json.dumps({"status": False, "error": f"{file.filename}:Invalid file Extension!"})

@app.route('/pythoncode', methods=['GET','POST'])  # Probably need to remove GET
@cross_origin()
def save_code():
    logging.info(f"Saving code from {request.remote_addr}")
    # print("This is save_code()")
    if request.method == 'POST':
        database_name = request.args.get('database')
        table_name = request.args.get('table')
        data = request.data
        data = data.decode("utf-8").strip()
        print("database_name",database_name)
        print("table_name",table_name)
        print("data",data)
        with open("analysis_code.json","r+") as code_file:
            file_data = json.load(code_file)
            print("data read from the file is",file_data)
            db = file_data.get(database_name)
            if db:
                tbl = db.get(table_name)
                if tbl:
                    last_modified = tbl.get("last_modified")
                    code = tbl.get("code")
                    mapper = tbl.get("mapper")
                    tbl.update({"last_modified": date.today().strftime("%d-%m-%Y")})
                    tbl.update({"code": data})
                    file_data.update({database_name: db})
                else:
                    dictionary = {}
                    dictionary.update({"last_modified": date.today().strftime("%d-%m-%Y")})
                    dictionary.update({"mapper": None})
                    dictionary.update({"code": data})
                    db.update({table_name: dictionary})
                    file_data.update({database_name: db})
            else:
                x = {}
                dictionary = {}
                dictionary.update({"last_modified": date.today().strftime("%d-%m-%Y")})
                dictionary.update({"mapper": None})
                dictionary.update({"code": data})
                x.update({table_name: dictionary})
                file_data.update({database_name: x})
            print("The file data being written the file is:\n",json.dumps(file_data))
            print(json.dumps(file_data))
            code_file.seek(0)
            code_file.truncate()
            code_file.write(json.dumps(file_data))
            return json.dumps({"status": True, "message": f"Success"})
        return json.dumps({"status": False, "message": "Failed"})

@app.route('/savemapper', methods=['GET','POST'])  # Probably need to remove GET
@cross_origin()
def save_mapper():
    logging.info(f"Saving mapper from {request.remote_addr}")
    if request.method == 'POST':
        database_name = request.args.get('database')
        table_name = request.args.get('table')
        data = request.data
        # print(dir(request))
        # return json.dumps({"status": False, "message": "Failed"})
        data = json.loads(data.decode("utf-8").strip())
        logging.debug("Data is"+str(data))
        with open("analysis_code.json","r+") as code_file:
            file_data = json.load(code_file)
            db = file_data.get(database_name)
            if db:
                tbl = db.get(table_name)
                if tbl:
                    last_modified = tbl.get("last_modified")
                    code = tbl.get("code")
                    mapper = tbl.get("mapper")
                    tbl.update({"last_modified": date.today().strftime("%d-%m-%Y")})
                    tbl.update({"mapper": data})
                    file_data.update({database_name: db})
                else:
                    dictionary = {}
                    dictionary.update({"last_modified": date.today().strftime("%d-%m-%Y")})
                    dictionary.update({"mapper": data})
                    dictionary.update({"code": None})
                    db.update({table_name: dictionary})
                    file_data.update({database_name: db})
            else:
                x = {}
                dictionary = {}
                dictionary.update({"last_modified": date.today().strftime("%d-%m-%Y")})
                dictionary.update({"mapper": data})
                dictionary.update({"code": None})
                x.update({table_name: dictionary})
                file_data.update({database_name: x})
            print("The file data being written the file is:\n",json.dumps(file_data))
            code_file.seek(0)
            code_file.truncate()
            code_file.write(json.dumps(file_data))
            return json.dumps({"status": True, "message": "Success"})
        return json.dumps({"status": False, "message": "Failed"})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0')
else:
    exit(0)
