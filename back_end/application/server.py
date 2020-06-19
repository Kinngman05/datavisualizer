#!/usr/bin/python3
import sys
import zmq

import json
import logging

logging.basicConfig(
    filename= PATH+'application.log',
    format='%(asctime)s.%(msecs)-3d:%(filename)s:%(funcName)s:%(levelname)s:%(lineno)d:%(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
    level=logging.DEBUG
)

import database as db


PROTOCOL = 'tcp'
PORT = 49500

if(len(sys.argv) == 2):
    PORT = sys.argv[1]


def connect_mysql_database():
    print("Connecting to the database")
    process = db.main()
    process.setConnection()
    print("Connection successful")
    return process

def zmq_setup():
    context = zmq.Context()
    socket = context.socket(zmq.REP)
    socket.bind(f"{PROTOCOL}://*:{PORT}")
    return socket

def main():
    print(f"Server startup on port number {PORT} with protocol {PROTOCOL}")
    print("Current libzmq version is %s" % zmq.zmq_version())
    print("Current  pyzmq version is %s" % zmq.__version__)

    mysql_connection = connect_mysql_database()
    socket = zmq_setup()

    try:
        while True:
            message = socket.recv()
            print("Received request: %s" % message)

            mysql_connection.input(json.loads(message[3:]),0)
            result = mysql_connection.processRequest()
            data = bytes(json.dumps(result),"utf-8")
            socket.send(data)
    except KeyboardInterrupt:
        print("Shutting down server")

if __name__ == "__main__":
    main()
else:
    pass