from flask import Flask, render_template, request,send_file
from werkzeug.utils import secure_filename
from flask_cors import CORS
app = Flask(__name__)
cors = CORS(app)
app.secret_key = "secret key"

@app.route('/file', methods = ['GET', 'POST'])
def upload_file():
   if request.method == 'POST':
      f = request.files['file']
      f.save(secure_filename(f.filename))
      return 'file uploaded successfully'
		
@app.route('/download', methods= ['GET'])
def down_load():
   try:
      return send_file('noi_dung.txt',as_attachment=True)
   except:
      raise Exception
if __name__ == '__main__':
   app.run()