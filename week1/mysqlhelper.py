import pymysql  

class MysqlHelper:
    

    def __init__(
        self,
        host="localhost",
        user="root",
        password="123",
        database="student_db",
        port=3306,
        charset="utf8mb4"
    ):
        
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.port = port
        self.charset = charset

    def get_connection(self):
       
        return pymysql.connect(
            host=self.host,
            user=self.user,
            password=self.password,
            database=self.database,
            port=self.port,
            charset=self.charset
        )

    def query(self, sql, params=None):
        
        conn = self.get_connection()
        cursor = conn.cursor()

        try:
            cursor.execute(sql, params)
            result = cursor.fetchall()
            return result
        finally:
            cursor.close()
            conn.close()

    def execute(self, sql, params=None):
        
        conn = self.get_connection()
        cursor = conn.cursor()

        try:
            affected_rows = cursor.execute(sql, params)
            conn.commit()
            return affected_rows
        except Exception as e:
            conn.rollback()
            print("Database operation failed:", e)
            return 0
        finally:
            cursor.close()
            conn.close()

    # 针对不会sql语句的使用者
    def get_all_students(self):
        sql = "SELECT * FROM students"
        return self.query(sql)
    # 查
    def get_student_by_id(self, student_id):
        sql = "SELECT * FROM students WHERE student_id = %s"
        return self.query(sql, (student_id,))
    
    # 增
    def add_student(self, student_id, name, height):
        sql = """
        INSERT INTO students (student_id, name, height)
        VALUES (%s, %s, %s)
        """
        return self.execute(sql, (student_id, name, height))
    # 改
    def update_student(self, student_id, name=None, height=None):
        
        if name is None and height is None:
            print("No information provided to update.")
            return 0

        fields = []  
        params = []  

        if name is not None:
            fields.append("name = %s")
            params.append(name)

        if height is not None:
            fields.append("height = %s")
            params.append(height)

        
        sql = "UPDATE students SET " + ", ".join(fields) + " WHERE student_id = %s"

        
        params.append(student_id)

        return self.execute(sql, tuple(params))

    # 删
    def delete_student(self, student_id):
        sql = "DELETE FROM students WHERE student_id = %s"
        return self.execute(sql, (student_id,))
