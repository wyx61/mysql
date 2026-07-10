from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql


app = Flask(__name__)
app.json.ensure_ascii = False
CORS(app)


DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "123",
    "database": "week5_db",
    "charset": "utf8mb4"
}


def get_connection():
    return pymysql.connect(**DB_CONFIG)


@app.route("/")
def index():
    return "Flask backend is running!"


@app.route("/api/get", methods=["GET"])
def get_data():
    param = request.args.get("param")

    return jsonify({
        "message": f"参数是 {param}"
    })


@app.route("/api/post", methods=["POST"])
def post_data():
    param = request.args.get("param")

    data = request.get_json()
    body_value = data.get("bodyValue")

    return jsonify({
        "message": f"body中的参数是 {body_value}，param中的参数是 {param}"
    })


@app.route("/api/sales", methods=["GET"])
def get_sales():
    conn = get_connection()
    cursor = conn.cursor()

    sql = "SELECT month, amount FROM sales ORDER BY id"
    cursor.execute(sql)
    results = cursor.fetchall()

    cursor.close()
    conn.close()

    months = []
    amounts = []

    for row in results:
        months.append(row[0])
        amounts.append(row[1])

    return jsonify({
        "months": months,
        "amounts": amounts
    })


@app.route("/api/categories", methods=["GET"])
def get_categories():
    conn = get_connection()
    cursor = conn.cursor()

    sql = "SELECT name, value FROM categories ORDER BY id"
    cursor.execute(sql)
    results = cursor.fetchall()

    cursor.close()
    conn.close()

    data = []

    for row in results:
        data.append({
            "name": row[0],
            "value": row[1]
        })

    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
