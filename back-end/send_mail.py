from flask_mail import Mail, Message
from flask import Flask

app = Flask(__name__)
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'linhupdate2@gmail.com'
app.config['MAIL_PASSWORD'] = '1s2heaven@'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)
@app.route('/')
def send_email():
    msg = Message( 'hello',sender='tomato', recipients=['linhbqgch16506@fpt.edu.vn'])
    mail.send(msg)
    return 'send'
if __name__ == '__main__':
    app.run()
