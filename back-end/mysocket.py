from flask import Flask, render_template,jsonify, json, request,send_from_directory
from flask_socketio import SocketIO,send,emit,join_room,leave_room
from flask_cors import CORS
from flask_jwt_extended import create_access_token, JWTManager
from flask_bcrypt import Bcrypt

from flask_mail import Mail, Message

from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
app.config['JWT_SECRET_KEY'] = 'Meow meow meow'

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'linhupdate2@gmail.com'
app.config['MAIL_PASSWORD'] = '1s2heaven@'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)

socketio = SocketIO(app,cors_allowed_origins="*")
cors = CORS(app, resources={r"/*": {"origins": "*"}})
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

FILE_DIRECTORY = "D://save_file"
if not os.path.exists(FILE_DIRECTORY):
   os.makedirs(FILE_DIRECTORY)

import mymodel
from mymodel import db 
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
        elif role == 'admin':
            db_password = account['admin_password']
            name = account
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
    print(data)
    emit('get',data,room= room)

# add a message to database
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

# get dashboard date
# @app.route('/dashboard_message', methods = ['GET'])
# def get_dashboard_message():
#     print('get dashboard')
#     start = request.args.get('start')
#     print(start)
#     end = request.args.get('end')
#     print(end)
#     room =  request.args.get('room')
#     print(room)
#     value = (start,end,room)
#     result = db.get_dashboard(value)
#     print(result)
#     return jsonify(result)

# insert comment
@app.route('/add_comment', methods = ['PUT'])
def insert_comment():
    print('add comment')
    content = request.json.get('content')
    print(content)
    doc_id = request.json.get('docId')
    comment = (content,doc_id)
    result = db.insert_comment(comment)
    return jsonify(result)

@socketio.on('get_comment')
def get_comment(comment):
    print('on get comment')
    print(comment)
    result = db.get_comments((comment,))
    print(result)
    emit('get_comment',result)

#student report
@socketio.on('get_report')
def get_report(id):
    print('get report')
    result = db.get_report((id['email'],id['email'],id['room']))
    print(result)
    emit('get_report',result)

@app.route('/get_report', methods = ['GET'])
def get_report():
    email = request.args.get('email')
    room = request.args.get('room')
    result = db.get_report((email,email,room))
    return jsonify(result)

@app.route('/tutor_get_report_message_7',methods=['GET'])
def tutor_get_report_message_7():
    print('tutor_get_report_message')
    email = request.args.get('email')
    result = db.tutor_get_report_message_7((email,email))
    print(result)
    return jsonify(result)

@app.route('/tutor_get_report_message_28',methods=['GET'])
def tutor_get_report_message_28():
    print('tutor_get_report_message')
    email = request.args.get('email')
    result = db.tutor_get_report_message_28((email,email))
    print(result)
    return jsonify(result)

@app.route('/get_all_tutor_messages',methods=['GET'])
def get_all_tutor_messages():
    print('get_all_tutor_messages')
    email = request.args.get('email')
    result = db.get_tutor_all_messages((email,email))
    print(result)
    return jsonify(result)

@app.route('/sendmail',methods=['POST'])
def send_email():
    tutor = request.json.get('tutor_email')
    student =  request.json.get('student_email')
    content1 = db.get_notify('to tutor for allocation')
    content2 = db.get_notify('to student for allocation')
    c1 = content1['notify_content'] + student
    c2 = content2['notify_content'] + tutor
    msg1 = Message( 'To tutor for allocation',body = c1 ,sender='Greenwich', recipients=[tutor])
    msg2 = Message( 'To student for allocation',body = c2 ,sender='Greenwich', recipients=[student])
    mail.send(msg1)
    mail.send(msg2)
    return jsonify('send')

@app.route('/sendmail_reallocation',methods=['POST'])
def send_email_re():
    tutor = request.json.get('tutor_email')
    student =  request.json.get('student_email')
    content3 = db.get_notify('to tutor for reallocation')
    content4 = db.get_notify('to student for reallocation')
    c3 = content3['notify_content'] + student
    c4 = content4['notify_content'] + tutor
    msg1 = Message( 'To tutor for reallocation',body = c3 ,sender='Greenwich', recipients=[tutor])
    msg2 = Message( 'To student for reallocation',body = c4 ,sender='Greenwich', recipients=[student])
    mail.send(msg1)
    mail.send(msg2)
    return jsonify('send')

@app.route('/get_available_students', methods = ['GET'])
def get_availablestudent():
    res = db.getavilstu()
    string = []
    for result in res:
        content = {'mail':result['student_email'], 'name':result['student_name']}
        string.append(content)
    return jsonify(string)

@app.route('/getalltutor', methods = ['GET'])
def get_alltutor():
    res = db.getalltutor()
    string = []
    for result in res:
        content = {'mail':result['tutor_email'], 'name':result['tutor_name']}
        string.append(content)
    return jsonify(string)

@app.route('/getallstudent', methods = ['GET'])
def get_allstudent():
    res = db.get_all_student()
    string = []
    for result in res:
        content = {'mail':result['student_email'], 'name':result['student_name']}
        string.append(content)
    return jsonify(string)

@app.route('/getallstaff', methods = ['GET'])
def get_allstaff():
    res = db.get_all_staff()
    string = []
    for result in res:
        content = {'mail':result['staff_email'], 'name':result['staff_name']}
        string.append(content)
    return jsonify(string)

@app.route('/get_staff_report',methods = ['GET'])
def get_staff_report():
    staff_mail = request.args.get('email')
    dbresult = db.get_staff_report((staff_mail,))
    return jsonify(dbresult)

@app.route('/allocation', methods = ['POST'])
def r_allocate():
    print(request)
    student_email = request.json.get('student_email')
    tutor_email = request.json.get('tutor_email')
    creator =  request.json.get('creator')
    room = (student_email, tutor_email, creator)
    result = db.allocate(room)
    return jsonify({'result':result})

@app.route('/reallocation', methods = ['POST'])
def reallocate():
    print(request)
    room = request.json.get('id')  
    
    result = db.reallocate((room,))
    return jsonify({'result':result})

@app.route('/get_room',methods = ['GET'])
def get_room():
    print('get room')
    result = db.get_room_info()
    return jsonify(result)

if __name__ == '__main__':
    socketio.run(app,port=2222)