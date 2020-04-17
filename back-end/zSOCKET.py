from flask import Flask, render_template,jsonify, json, request
from flask_socketio import SocketIO,send,emit,join_room,leave_room
from flask_cors import CORS
from flask_jwt_extended import create_access_token, JWTManager
from flask_bcrypt import Bcrypt

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
app.config['JWT_SECRET_KEY'] = 'Meow meow meow'

socketio = SocketIO(app,cors_allowed_origins="*")
cors = CORS(app, resources={r"/*": {"origins": "*"}})
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

import zMODEL
from zMODEL import db 
db = db() 


@app.route('/login', methods = ['POST'])
def login():
    token = ''
    email = request.json.get('email')
    get_password = request.json.get('password')
    account = db.login((email,))
    if account is None:
        return jsonify({'token':''})
    role = account['role']
    if account is not None:
        if role == 'student':
            db_password = account['student_password']
        elif role == 'tutor':
            db_password = account['tutor_password']
        elif role == 'staff':
            db_password = account['staff_password']
        if bcrypt.check_password_hash(db_password,get_password):
            token = create_access_token(identity = email)
    return jsonify({'token':token,'role':role,'email':email})

#create account 
@app.route('/signup/<role>', methods = ['PUT'])
def signup(role):
    email = request.json.get('email')
    pw = request.json.get('password')
    name = request.json.get('name')
    password = bcrypt.generate_password_hash(pw).decode('utf-8')
    print(password)
    value = (email,password,name)
    result = db.signup(role,value)
    return jsonify({'result':result})

#get room for student
@app.route('/room',methods = ['GET'])
def getRoom():
    print('get room')
    email = request.args.get('student')
    room = db.getRoom(email)
    print(room)
    return jsonify(room)

# get list rooms for tutor
@app.route('/listrooms', methods = ['GET'])
def get_list_rooms():
    print('get list rooms')
    tutor_email = request.args.get('tutor_email')
    rooms = db.get_tutor_rooms(tutor_email)
    print(rooms)
    return jsonify(rooms)



@socketio.on('message')
def message(data):
    print('on message')
    room = data['room']
    content = data['content']
    by = data['by']
    at = data['at']
    data = {'message_id':'0','message_content':content,'upload_at':at,'upload_by':by,'room_id':room}
    join_room(room)
    emit('message',data,room = room)


@socketio.on('get')
def get(room):
    print('on get')
    print(room)
    data = db.get_message(room)
    join_room(room)
    emit('get',data,room= room)

@socketio.on('add_message')
def add_message(message):
    print('on add_message')
    content = message['content']
    by = message['by']
    at = message['at']
    room = message['room']
    added_message = (content,by,at,room)
    db.add_message(added_message)

if __name__ == '__main__':
    socketio.run(app,port=2222)