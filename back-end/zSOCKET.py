from flask import Flask, render_template,jsonify, json, request,send_from_directory
from flask_socketio import SocketIO,send,emit,join_room,leave_room
from flask_cors import CORS
from flask_jwt_extended import create_access_token, JWTManager
from flask_bcrypt import Bcrypt

from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
app.config['JWT_SECRET_KEY'] = 'Meow meow meow'

socketio = SocketIO(app,cors_allowed_origins="*")
cors = CORS(app, resources={r"/*": {"origins": "*"}})
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

FILE_DIRECTORY = "D://Repositories//Project//back-end//save_file"

import zMODEL
from zMODEL import db 
db = db() 

# login for users
@app.route('/login', methods = ['POST'])
def login():
    token = ''
    email = request.json.get('email')
    get_password = request.json.get('password')
    account = db.login((email,))
    name =''
    if account is None:
        return jsonify({'token':''})
    role = account['role']
    if account is not None:
        if role == 'student':
            db_password = account['student_password']
            name = account['student_name']
        elif role == 'tutor':
            db_password = account['tutor_password']
            name = account['tutor_name']
        elif role == 'staff':
            db_password = account['staff_password']
            name = account['staff_name']
        if bcrypt.check_password_hash(db_password,get_password):
            token = create_access_token(identity = email)
    return jsonify({'token':token,'role':role,'email':email,'name':name})

# create account for roles
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

# get room for student
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


# emit a single mesage to client
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

# get list all messages stored in database
@socketio.on('get')
def get(room):
    print('on get')
    print(room)
    data = db.get_message(room)
    join_room(room)
    emit('get',data,room= room)

# add a message to datanase
@socketio.on('add_message')
def add_message(message):
    print('on add_message')
    content = message['content']
    by = message['by']
    at = message['at']
    room = message['room']
    added_message = (content,by,at,room)
    db.add_message(added_message)

# user upload document
@app.route('/upload', methods=['POST'])
def upload():
    try:
        file = request.files['file']
        name = file.filename
        title = request.form['title']
        by =  request.form['by']
        at = request.form['at']
        full_path = request.form['full_path']
        room = request.form['room']
        file_name = secure_filename(full_path)
        file.save(os.path.join(FILE_DIRECTORY,file_name))
        document = (name,title,at,by,full_path,room)
        result = db.add_document(document)
        return jsonify({'result':result})
    except:
        raise Exception
        return jsonify({'result':'error'})

# get list documents in a room
@app.route('/list_files', methods=['GET'])
def get_list_file():
   room = request.args.get('room')
   r = (room,)
   print(db.get_document(r))
   return jsonify(db.get_document(r)) 

# download file
@app.route('/download', methods= ['GET'])
def down_load():
   try:
      file = request.args.get('path')
      file_name = secure_filename(file)
      print(file_name)
      return send_from_directory(FILE_DIRECTORY,file_name,as_attachment=True)
   except:
      raise Exception

# emit event to client
@socketio.on('calendar')
def message(data):
    print('on calendar')
    room = data['room']
    title = data['title']
    start = data['start']
    end = data['end']
    color = data['color']
    event = {'title':title,'start':start,'end':end,'color':color,'room_id':room}
    join_room(room)
    emit('calendar',data,room = room)

# get list event in database
@socketio.on('get_calendar')
def get_events(room):
    print(room)
    data = db.get_events((room,))
    join_room(room)
    emit('get_calendar_1',data,room= room)

# add event to database
@socketio.on('add_calendar')
def add_event(event):
    title = event['title']
    start = event['start']
    end = event['end']
    color = event['color']['primary']
    # co = color[1:-1]
    room = event['room']
    event = (title,start,end,color,room)
    print(event)
    db.insert_event(event)

if __name__ == '__main__':
    socketio.run(app,port=2222)