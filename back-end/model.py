import mysql.connector

def conn1():
    return mysql.connector.connect(
        host = 'localhost',
        user = 'root',
        password = '1234',
        database = 'project'
    )
class db:
    def add(self,object,value):
        try:
            query1 = "insert into student(student_email,student_password) values(%s,%s);"
            conn = conn1()
            self.cursor = conn.cursor(buffered=True , dictionary=True)
            if object == 'student':
                self.cursor.execute(query1,value)
            conn.commit()
            re = self.cursor.rowcount
            self.cursor.close()
            conn.close()
            print(re)
            return re
        except:
            #raise Exception
            return 0
    
    def get(self,object,value):
        try:
            query1 = "select * from student where student_email = %s"
            conn = conn1()
            self.cursor = conn.cursor(buffered=True , dictionary=True)
            student_email = (value,)
            self.cursor.execute(query1,student_email)
            result = self.cursor.fetchone()
            return result
        except:
            return None