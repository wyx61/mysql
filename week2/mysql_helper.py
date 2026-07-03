import pymysql


class MySqlHelper:
    def __init__(self, host="localhost", user="root", password="123",
                 database="baidutop10", port=3306):
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

    def create_hot_search_table(self):
        sql = """
        CREATE TABLE IF NOT EXISTS baidu_hot_search (
            id INT PRIMARY KEY AUTO_INCREMENT,
            rank_no INT,
            title VARCHAR(255),
            hot_score VARCHAR(50),
            url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """

        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(sql)
        conn.commit()
        cursor.close()
        conn.close()

    def clear_hot_search_table(self):
        sql = "TRUNCATE TABLE baidu_hot_search;"

        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(sql)
        conn.commit()
        cursor.close()
        conn.close()

    def insert_hot_search(self, rank_no, title, hot_score, url):
        sql = """
        INSERT INTO baidu_hot_search (rank_no, title, hot_score, url)
        VALUES (%s, %s, %s, %s);
        """

        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(sql, (rank_no, title, hot_score, url))
        conn.commit()
        cursor.close()
        conn.close()

    def select_hot_search(self):
        sql = """
        SELECT rank_no, title, hot_score
        FROM baidu_hot_search
        ORDER BY rank_no ASC;
        """

        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(sql)
        results = cursor.fetchall()
        cursor.close()
        conn.close()

        return results
