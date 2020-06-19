#!/usr/bin/python3
from flask import Flask, render_template, request
from flask_socketio import SocketIO
from flask_socketio import send, emit

import json
import logging
import database as db

#
# New untested code added here
#
import threading

def set_interval(func, sec):
    def func_wrapper():
        set_interval(func, sec)
        func()
    t = threading.Timer(sec, func_wrapper)
    t.start()
    return t


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app,cors_allowed_origins="*")

print("Connecting to the database")
process = db.main()
process.setConnection()
print("Connection successful")


@socketio.on('connect')
def handle_my_custom_event():
    if request.args.get('fail'):
        return False
    print("CONNECTED!!!")
    emit('my response', "Hello from python server")

@socketio.on('test_event')
def handle_message(message):
    print('received message: ' + str(message))

@socketio.on('message')       #I actually need to change this to json *face palm*
def handle_message(message):
    print('received message: ' + str(message) + "message type:"+ str(type(message)))
    process.input(message,0)
    result = process.processRequest()
    if(result):
        print("The result is:",result)
        send(str(json.dumps(result)))
    else:
        print("No result sent back from the database")

@socketio.on('json')
def handle_json(json):
    print('received json: ' + str(json))


@socketio.on("insert_data")
def insert_data_to_db(message):
    print("Inserting data to the database")
    import time
    time.sleep(5)
    print("moving to next")
    import os
    os.system("/home/tarun/github/dbms_project/mock_data/insert_mock_data.py")
    time.sleep(1)
    def restart():
        import sys
        print("argv was",sys.argv)
        print("sys.executable was", sys.executable)
        print("restart now")
        import os
        os.execv(sys.executable, ['python'] + sys.argv)
    restart()

@socketio.on("delete_data")
def delete_data_from_db(message):
    import time
    print("Deleting data to the database")
    message = json.loads("""{"HEADER":{"DATABASE":"stocks","TABLE_NAME":"raw_data_bhel","REQUEST_TYPE":"delete"},"DATA":{"FIELDS":null,"SET":null,"WHERE":{"__QUERY__":"`date` BETWEEN '2019-04-01' AND '2019-10-20'"}},"FOOTER":{"DATA ABOUT THE REQUEST":"ins_mock_data","COMMENT":"dbms_project","DEP":null,"UPDATE":null}}""")
    process.input(message,0)
    result = process.processRequest()
    time.sleep(1)
    def restart():
        import sys
        print("argv was",sys.argv)
        print("sys.executable was", sys.executable)
        print("restart now")

        import os
        os.execv(sys.executable, ['python'] + sys.argv)
    restart()

@socketio.on_error_default  # handles all namespaces without an explicit error handler
def default_error_handler(e):
    print("ERROR ENCOUNTERED")
    print("args:" + request.event)

@socketio.on('disconnect')
def handle_disconnect():
    print("The client disconnected.")

if __name__ == '__main__':
    socketio.run(app,debug=True)
else:
    exit(0)
