#!/usr/bin/python3
import database as db
import json
from flask import Flask, render_template, request
from flask_socketio import SocketIO
from flask_socketio import send, emit
from flask_cors import CORS, cross_origin
from flask import flash, request, redirect, url_for
from werkzeug.utils import secure_filename

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
        print("The result is:", result)
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


@app.route('/upload', methods=['GET', 'POST'])  # Probably need to remove GET
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
            logging.info(
                f"Saving file {filename} at {app.config['UPLOAD_FOLDER']}")
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            # return redirect(url_for('uploaded_file',filename=filename))
            return json.dumps({"status": True, "message": f"{file.filename}"})
        else:
            return json.dumps({"status": False, "error": f"{file.filename}:Invalid file Extension!"})


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', debug=True)
else:
    exit(0)
