from flask import Flask, render_template, request,send_file,jsonify,send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import CORS
import mysql.connector
import os
import json

app = Flask(__name__)
cors = CORS(app)
app.secret_key = "secret key"

FILE_DIRECTORY = "D://Repositories//Project//back-end//save_file"

if not os.path.exists(FILE_DIRECTORY):
   os.makedirs(FILE_DIRECTORY)



@app.route('/test', methods= ['GET'])
def test():
   try:
      return send_from_directory(FILE_DIRECTORY,'test.docx',as_attachment=True)
      print('test')
   except:
      raise Exception
      return jsonify({'result':'wrong'})




if __name__ == '__main__':
   app.run(host = '127.0.0.1', port ='5500')