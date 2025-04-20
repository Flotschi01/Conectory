from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysql import MySQL
from config import db_config

app = Flask(__name__)
CORS(app)  # Allow frontend to connect

# DB Configuration
for key, value in db_config.items():
    app.config[key] = value

mysql = MySQL(app)

@app.route("/contacts", methods=["GET"])
def get_contacts():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id, name, occupation FROM contacts")
    rows = cursor.fetchall()
    contacts = [{"id": row[0], "name": row[1], "occupation": row[2]} for row in rows]
    return jsonify(contacts)

@app.route("/contacts", methods=["POST"])
def add_contact():
    data = request.get_json()
    cursor = mysql.connection.cursor()
    cursor.execute(
        "INSERT INTO contacts (name, occupation) VALUES (%s, %s)",
        (data["name"], data["occupation"])
    )
    mysql.connection.commit()
    return jsonify({"message": "Contact added"}), 201

# Add PUT and DELETE routes as needed

if __name__ == "__main__":
    app.run(debug=True)
