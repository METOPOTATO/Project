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

    #get dashboard data
    def get_dashboard(self,value):
        try:
            query = "select * from documents where upload_at between %s and %s and room_id = %s"
            conn = conn1()
            cursor = conn.cursor(buffered=True , dictionary=True)
            cursor.execute(query,value)
            result = cursor.fetchall()
            cursor.close()
            conn.close()
            return result
        except:
            raise Exception
            return 'wrong'
    
    # insert comments
    def insert_comment(self,event):
        try:
            query = "insert into comments(comment_content,document_id) values(%s,%s);"
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

    # get comments
    def get_comments(self,id):
        try:
            query = "select * from comments where document_id = %s"
            conn = conn1()
            cursor = conn.cursor(buffered=True , dictionary=True)
            cursor.execute(query,id)
            result = cursor.fetchall()
            cursor.close()
            conn.close()
            return result
        except:
            raise Exception
            return 'wrong'

    #  get  reports
    def get_report_message(self,id):
        try:
            query = "select count(*) as mess from messages where upload_at > date(now()) - interval 7 day and room_id = %s;"
            conn =  conn1()
            cursor = conn.cursor(buffered=True , dictionary=True)
            cursor.execute(query,id)
            result = cursor.fetchall()
            cursor.close()
            conn.close()
            return result
        except:
            raise Exception
            return 'wrong'
    def get_report_document(self,id):
        try:
            query = "select count(*) as doc from documents where upload_at > date(now()) - interval 7 day and room_id = %s;"
            conn =  conn1()
            cursor = conn.cursor(buffered=True , dictionary=True)
            cursor.execute(query,id)
            result = cursor.fetchall()
            cursor.close()
            conn.close()
            return result
        except:
            raise Exception
            return 'wrong'
    def get_report_calendar(self,id):
        try:
            query = "select count(*) as can from timetable where time_start > date(now()) - interval 7 day and room_id = %s;"
            conn =  conn1()
            cursor = conn.cursor(buffered=True , dictionary=True)
            cursor.execute(query,id)
            result = cursor.fetchall()
            cursor.close()
            conn.close()
            return result
        except:
            raise Exception
            return 'wrong'
# student report
    def get_report(self,id):
        try:
            query7 = '''
            select a.count as mes,b.count as doc,c.count as can from 
            (select count(*) as count from messages  where upload_at > date(now()) - interval 7 day and upload_by =%s) as a,
            (select count(*) as count from documents where upload_at > date(now()) - interval 7 day and upload_by =%s) as b,
            (select count(*) as count from timetable where time_start > date(now()) - interval 7 day and room_id =%s) as c;
            '''
            query3 = '''
            select a.count as mes,b.count as doc,c.count as can from 
            (select count(*) as count from messages  where upload_at > date(now()) - interval 3 day and upload_by =%s) as a,
            (select count(*) as count from documents where upload_at > date(now()) - interval 3 day and upload_by =%s) as b,
            (select count(*) as count from timetable where time_start > date(now()) - interval 3 day and room_id =%s) as c;
            '''
            query14 = '''
            select a.count as mes,b.count as doc,c.count as can from 
            (select count(*) as count from messages  where upload_at > date(now()) - interval 14 day and upload_by =%s) as a,
            (select count(*) as count from documents where upload_at > date(now()) - interval 14 day and upload_by =%s) as b,
            (select count(*) as count from timetable where time_start > date(now()) - interval 14 day and room_id =%s) as c;
            '''
            query28 = '''
            select a.count as mes,b.count as doc,c.count as can from 
            (select count(*) as count from messages  where upload_at > date(now()) - interval 28 day and upload_by =%s) as a,
            (select count(*) as count from documents where upload_at > date(now()) - interval 28 day and upload_by =%s) as b,
            (select count(*) as count from timetable where time_start > date(now()) - interval 28 day and room_id =%s) as c;
            '''
            conn =  conn1()
            cursor = conn.cursor(buffered=True , dictionary=True)
            cursor.execute(query3,id)
            result3 = cursor.fetchall()
            cursor.execute(query7,id)
            result7 = cursor.fetchall()
            cursor.execute(query14,id)
            result14 = cursor.fetchall()
            cursor.execute(query28,id)
            result28 = cursor.fetchall()
            cursor.close()
            conn.close()
            return result3 + result7 + result14 + result28
        except:
            raise Exception
            return 'wrong'

    def tutor_get_report_message_7(self,tutor_email):
        try:
            query = '''
            select a.student_email as student,
            (select student_name from students as d where d.student_email = a.student_email) as name,
            a.room_id as room,
            (select count(*) from messages as b where b.upload_by = %s and b.room_id = a.room_id and b.upload_at > date(now()) - interval 7 day) as send, 
            (select count(*) from messages as c where c.upload_by = a.student_email  and c.upload_at > date(now()) - interval 7 day) as receive
            from rooms as a where a.tutor_email= %s;
            '''
            conn =  conn1()
            cursor = conn.cursor(buffered=True , dictionary=True)
            cursor.execute(query,tutor_email)
            result = cursor.fetchall()
            cursor.close()
            conn.close()
            return result
        except:
            raise Exception
            return 'wrong'

    def tutor_get_report_message_28(self,tutor_email):
        try:
            query = '''
            select a.student_email as student,
            (select student_name from students as d where d.student_email = a.student_email) as name,
            a.room_id as room,
            (select count(*) from messages as b where b.upload_by = %s and b.room_id = a.room_id and b.upload_at > date(now()) - interval 28 day) as send, 
            (select count(*) from messages as c where c.upload_by = a.student_email  and c.upload_at > date(now()) - interval 28 day) as receive
            from rooms as a where a.tutor_email= %s;
            '''
            conn =  conn1()
            cursor = conn.cursor(buffered=True , dictionary=True)
            cursor.execute(query,tutor_email)
            result = cursor.fetchall()
            cursor.close()
            conn.close()
            return result
        except:
            raise Exception
            return 'wrong'

    def get_tutor_all_messages(self,email):
        try:
            query = '''
            select a.tutor_messages,b.tutor_students from 
            (select count(*) as tutor_messages  from messages where upload_by = %s) as a,
            (select count(*) as tutor_students from rooms where tutor_email = %s) as b;
            '''
            conn =  conn1()
            cursor = conn.cursor(buffered=True , dictionary=True)
            cursor.execute(query,email)
            result = cursor.fetchall()
            cursor.close()
            conn.close()
            return result
        except:
            raise Exception
            return 'wrong'
    ####### Huy ##########
    def allocate(self,value):
        query = 'insert into rooms (student_email, tutor_email, creater) values (%s,%s,%s);'
        conn = conn1()
        cursor = conn.cursor(buffered=True , dictionary=True)
        cursor.execute(query,value)
        conn.commit()
        row_affected = cursor.rowcount
        conn.close()
        cursor.close()
        return row_affected

    def getalltutor(self):
        conn = conn1()
        query = 'select * from tutors'
        cursor = conn.cursor(buffered=True, dictionary=True)
        cursor.execute(query)
        result = cursor.fetchall()
        conn.close()
        cursor.close()
        return result

    def getavilstu(self):
        conn = conn1()
        query = 'select * from students where student_email NOT IN ( select student_email from rooms )'
        cursor = conn.cursor(buffered=True, dictionary=True)
        cursor.execute(query)
        result = cursor.fetchall()
        return result

    