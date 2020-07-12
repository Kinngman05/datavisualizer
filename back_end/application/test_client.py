#!/usr/bin/python3
import sys
import zmq

PROTOCOL = 'tcp'
PORT = 49500

if(len(sys.argv) == 2):
    PORT = sys.argv[1]

context = zmq.Context()

#  Socket to talk to server
print(f"Connecting to server at {PORT}")
socket = context.socket(zmq.REQ)
socket.connect(f"{PROTOCOL}://localhost:{PORT}")

#  Do 10 requests, waiting each time for a response
while True:
    # print("Sending request %s …" % request)
    message = bytes("FUK"+input("Enter message:"),"utf-8")
    socket.send(message)

    #  Get the reply.
    message = socket.recv()
    print("Received reply %s [ %s ]" % ("-", message))