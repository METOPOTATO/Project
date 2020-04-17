import zMODEL
from zMODEL import db

from flask import Flask, jsonify, json, request
from flask_jwt_extended import create_access_token, JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS



app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'Meow meow meow'

#cors = CORS(app, resources={r"/*": {"origins": "*"}})
cors = CORS(app)

bcrypt = Bcrypt(app)
jwt = JWTManager(app)

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


if __name__ == '__main__':
    app.run(host = '127.0.0.1', port ='2222')

