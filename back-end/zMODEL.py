import mysql.connector

def conn1():
    return mysql.connector.connect(
        host = 'localhost',
        user = 'root',
        password = '1234',
        database = 'project'
    )

class db:
    #login for users
    def login(self,value):
        try:
            query1 = 'select * from students where student_email = %s'
            query2 = 'select * from tutors where tutor_email = %s'
            query3 = 'select * from staffs where staff_email = %s'
            conn = conn1()
            cursor = conn.cursor(buffered=True , dictionary=True)
            cursor.execute(query1,value)
            result1 = cursor.fetchone()
            if result1:
                result1.update({'role':'student'})
                return result1
            cursor.execute(query2,value)
            result2 = cursor.fetchone()
            if result2:
                result2.update({'role':'tutor'})
                return result2
            cursor.execute(query3,value)
            result3 = cursor.fetchone()
            if result3:
                result3.update({'role':'staff'})
                return result3
            conn.close()
            cursor.close()
            
            return None
        except:
            raise Exception
            return 'wrong'

    #signup--create account
    def signup(self,user,value):
        try:
            query1 = "insert into students(student_email,student_password,student_name) values(%s,%s,%s)"
            query2 = "insert into staffs(staff_email,staff_password,staff_name) values(%s,%s,%s)"
            query3 = "insert into tutors(tutor_email,tutor_password,tutor_name) values(%s,%s,%s)"
            conn =conn1()
            cursor = conn.cursor(buffered=True, dictionary=True)
            if ( user == 'student'):
                cursor.execute(query1,value)
            elif( user == 'staff'):
                cursor.execute(query2,value)
            elif( user == 'tutor'):
                cursor.execute(query3,value)
            conn.commit()
            row_affected = cursor.rowcount
            conn.close()
            cursor.close()
            return row_affected
        except:
           # raise Exception
            return 'wrong'

    # get all messages from a room
    def get_message(self,room):
        try:
            query = "select * from messages where room_id =%s"
            con = conn1()
            cursor =  con.cursor(buffered=True , dictionary=True)
            cursor.execute(query,(room,))
            result = cursor.fetchall()
            for re in result:
                re['upload_at'] = str(re['upload_at'])
            cursor.close()
            con.close()
            return result
        except:
            return 'wrong'

    #get room for student
    def getRoom(self,email):
        try:
            query = 'select room_id from rooms where student_email=%s '
            con = conn1()
            cursor =  con.cursor(buffered=True , dictionary=True)
            cursor.execute(query,(email,))
            result = cursor.fetchone()
            cursor.close()
            con.close()
            return result
        except:
            raise Exception
            return 'wrong'

    #get rooms for tutor
    def get_tutor_rooms(self,tutor):
        try:
            query = 'select room_id from rooms where tutor_email=%s'
            con = conn1()
            cursor =  con.cursor(buffered=True , dictionary=True)
            cursor.execute(query,(tutor,))
            result = cursor.fetchall()
            cursor.close()
            con.close()
            return result
        except:
            raise Exception
            return 'wrong'
            
    # insert a message
    def add_message(self,messages):
        try:
            query = "insert into messages(message_content,upload_by,upload_at,room_id) values(%s,%s,%s,%s);"
            con = conn1()
            cursor =  con.cursor(buffered=True , dictionary=True)
            cursor.execute(query,messages)
            con.commit()
            result = cursor.rowcount
            cursor.close()
            con.close()
            return result
        except:
            raise Exception
            return 'wrong'

    # add doccument
    def add_document(self,document):
        try:
            query = "insert into documents(document_name,title,upload_at,upload_by,full_path,room_id) values(%s,%s,%s,%s,%s,%s);"
            con = conn1()
            cursor =  con.cursor(buffered=True , dictionary=True)
            cursor.execute(query,document)
            con.commit()
            result = cursor.rowcount
            cursor.close()
            con.close()
            return result 
        except:
            raise Exception
            return 'wrong'

    # get documents in a room
    def get_document(self,room):
        try:
            query = 'select * from documents where room_id = %s'
            conn = conn1()
            cursor = conn.cursor(buffered=True , dictionary=True)
            cursor.execute(query,room)
            result = cursor.fetchall()
            cursor.close()
            conn.close()
            return result
        except:
            raise Exception
            return 'wrong'

    # insert event calendar to database
    def insert_event(self,event):
        try:
            query = "insert into timetable(title,time_start,time_end,corlor,room_id) values(%s,%s,%s,%s,%s);"
            con = conn1()
            cursor =  con.cursor(buffered=True , dictionary=True)
            cursor.execute(query,event)
            con.commit()
            result = cursor.rowcount
            cursor.close()
            con.close()
            return result 
        except:
            raise Exception
            return 'wrong'

    # get events of room
    def get_events(self,room):
        try:
            query = "select * from timetable where room_id = %s"
            conn = conn1()
            cursor = conn.cursor(buffered=True , dictionary=True)
            cursor.execute(query,room)
            result = cursor.fetchall()
            cursor.close()
            conn.close()
            return result
        except:
            raise Exception
            return 'wrong'