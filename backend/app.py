from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL  # Updated import
from config import db_config

app = Flask(__name__)
CORS(app)  # Allow frontend to connect

# DB Configuration
for key, value in db_config.items():
    app.config[key] = value
    print (f"Configuring {key} with value: {value}")
#app.config['MYSQL_HOST'] = 'localhost'  # Or your server IP
#app.config['MYSQL_USER'] = 'main'
#app.config['MYSQL_PASSWORD'] = 'MyConectoryIsSafe'  # << Typo fix: MYSQL not MYSQL
#app.config['MYSQL_DB'] = 'MainDB'
#app.config['MYSQL_PORT'] = 3306
mysql = MySQL(app)
@app.route("/contacts", methods=["GET"])
def get_contacts():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id, first_name, last_name, created_at FROM contacts")
    rows = cursor.fetchall()
    contacts = [{"id": row[0], "first_name": row[1], "last_name": row[2], "created_at": row[3]} for row in rows]
    return jsonify(contacts)

@app.route("/contacts", methods=["POST"])
def add_contact():
    data = request.get_json()
    cursor = mysql.connection.cursor()
    for key in data:
        print(f"Key: {key}, Value: {data[key]}")
    cursor.execute(
        "INSERT INTO contacts (first_name, last_name) VALUES (%s, %s)",
        (data["first_name"], data["last_name"])
    )
    mysql.connection.commit()
    return jsonify({"message": "Contact added"}), 201

# Add PUT and DELETE routes as needed
@app.route("/contacts/del/<int:contact_id>", methods=["DELETE"])
def delete_contact(contact_id):
    if request.method == "OPTIONS":
        # Handle preflight request
        return jsonify({"message": "Preflight request successful"}), 200

    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM contacts WHERE id = %s", (contact_id,))
    mysql.connection.commit()
    return jsonify({"message": "Contact deleted"}), 200

if __name__ == "__main__":
    app.run(debug=True)
