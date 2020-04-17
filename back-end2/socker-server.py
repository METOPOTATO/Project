from flask import Flask, render_template,jsonify
from flask_socketio import SocketIO,send,emit,join_room,leave_room
from flask_cors import CORS
import mysql.connector
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
socketio = SocketIO(app,cors_allowed_origins="*")
# cors = CORS(app)
cors = CORS(app, resources={r"/*": {"origins": "*"}})


def conn1():
    return mysql.connector.connect(
        host = 'localhost',
        user = 'root',
        password = '1234',
        database = 'mydatabase'
    )

# def a_message(value):
    print(value)
    query = "insert into message(message,room,sender) values( %s,%s,%s)"
    conn = conn1()
    cursor = conn.cursor(buffered=True , dictionary=True) 
    cursor.execute(query,value)
    conn.commit()
    re = cursor.rowcount
    cursor.close()
    conn.close()
    return re

# def g_message():
    query = "select * from message order by id desc limit 10 "
    conn = conn1()
    cursor = conn.cursor(buffered=True , dictionary=True) 
    cursor.execute(query,room)
    result = cursor.fetchall()
    return result

@socketio.on('connection')
def connect(data):
    print('hello')
    emit('connection','this' + data )

@socketio.on('get_message')
def get_message():
    result = g_message()
    a = []
    for re in result:
        id = re['id']
        message = re['message']
        a.append({"id":id,"message":message})
    emit('get_message',json.dumps(a))

@socketio.on('add_message')
def add_message(message):
    a_message((message,))
    get_message()
    print('Add success')

@socketio.on('message')
def message(data):
    # id = data['id']
    # mess = data['message']
    # user = data['user']
    print(data)
    room = data['room']
    join_room(room)
    emit('message',data, room = room)

if __name__ == '__main__':
    socketio.run(app)