import model
from model import db

from flask import Flask, jsonify, json, request
from flask_jwt_extended import create_access_token, JWTManager
from flask_bcrypt import Bcrypt

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'Meow meow meow'

bcrypt = Bcrypt(app)
jwt = JWTManager(app)

db = db() 

@app.route('/add', methods = ['POST'])
def add():
    username = request.json.get('username')
    password = bcrypt.generate_password_hash(request.get_json()['password']).decode('utf-8')
    obj = (username,password)
    check = db.add('student',obj)

    if check != 0:
        result = {'student_name':username,'student_password':password}
    else:
        result = ''
        
    return jsonify({'result':result})
    
@app.route('/get',methods = ['GET'])
def get():
    token = ''
    username = request.json.get('username')
    password1 = request.json.get('password')
    get_student = db.get('student',username)
    if get_student is not None:
        password2 = get_student['student_password']
        if bcrypt.check_password_hash(password2,password1):
            token = create_access_token(identity = username)
    return jsonify({'token':token})

if __name__ == '__main__':
    app.run()