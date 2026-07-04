import pymysql

class MySqlHelper:
    def __init__(self, host="localhost", user="root", password="123",
                 database="doubantop100", port=3306):
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.port = port

    def get_connection(self):
        return pymysql.connect(
            host=self.host,
            user=self.user,
            password=self.password,
            database=self.database,
            port=self.port,
            charset="utf8mb4"
        )

    def create_douban_top100_table(self):
        sql = """
        CREATE TABLE IF NOT EXISTS douban_top100 (
            id INT PRIMARY KEY AUTO_INCREMENT,
            rank_no INT,
            title VARCHAR(255),
            score VARCHAR(50),
            comment_num VARCHAR(50),
            year VARCHAR(50),
            country VARCHAR(250),
            category VARCHAR(250),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """

        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(sql)
        conn.commit()
        cursor.close()
        conn.close()
    def clear_douban_top100_table(self):
        sql = "TRUNCATE TABLE douban_top100;"

        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(sql)
        conn.commit()
        cursor.close()
        conn.close()
    def insert_douban_top100(self, rank_no, title, score, comment_num, year, country, category):
        sql = """
        INSERT INTO douban_top100 (rank_no, title, score, comment_num, year, country, category)
        VALUES (%s, %s, %s, %s, %s, %s, %s);
        """

        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(sql, (rank_no, title, score, comment_num, year, country, category))
        conn.commit()
        cursor.close()
        conn.close()
    def select_douban_top100(self):
        sql = "SELECT rank_no, title, score, comment_num, year, country, category FROM douban_top100;"

        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(sql)
        records = cursor.fetchall()
        cursor.close()
        conn.close()
        return records
    
