from mysqlhelper import MysqlHelper

def main():
    db = MysqlHelper(
        host="localhost",
        user="root",
        password="123",  # 本地运行时改成你的 MySQL 密码
        database="student_db"
    )

    print("Initial students:")
    students = db.get_all_students()
    for student in students:
        print(student)

    print("\nAdd a new student:")
    db.add_student("004", "Chen", 168.0)

    students = db.get_all_students()
    for student in students:
        print(student)

    print("\nUpdate student 004:")
    db.update_student("004", name="Chen New", height=171.0)

    student = db.get_student_by_id("004")
    print(student)

    print("\nDelete student 004:")
    db.delete_student("004")

    print("\nFinal students:")
    students = db.get_all_students()
    for student in students:
        print(student)


if __name__ == "__main__":
    main()
