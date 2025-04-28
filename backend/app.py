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
mysql = MySQL(app)

#----------------------------------------
#Get Contacts via SQL
#----------------------------------------
@app.route("/contacts", methods=["GET"])
def get_contacts():
    cursor = mysql.connection.cursor()
    projection = []
    if request.args.get("sql") == "" or request.args.get("sql") is None:
        cursor.execute("SELECT id, first_name, last_name, created_at FROM contacts")
        projection = ["id", "first_name", "last_name", "created_at"]
    else:
        sql_query = request.args.get("sql")
        print(f"SQL Query: {sql_query}")
        projection = sql_query.split("SELECT ")[1].split(" FROM")[0].split(",")
        if(projection[0] == "*"):
            projection = ["id", "first_name", "last_name", "created_at"]
        cursor.execute(sql_query)   # Use the provided SQL query
    rows = cursor.fetchall()
    contacts = []
    for row in rows:
            temp = {}
            for index, col in enumerate(projection):
                temp[col] = row[index]
            contacts.append(temp)
    # contacts = [{"id": row[0], "first_name": row[1], "last_name": row[2], "created_at": row[3]} for row in rows]
    print(f"Contacts: {jsonify(contacts)}")
    return jsonify(contacts)
#----------------------------------------
#Get Columns via SQL
#----------------------------------------
@app.route("/getColumns", methods=["GET"])
def get_Columns():
    table_name = request.args.get("table_name")
    cursor = mysql.connection.cursor()
    cursor.execute(f"SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '{table_name}'")
    columns = [row[0] for row in cursor.fetchall()]
    return jsonify(columns)
#----------------------------------------
#Add a new contact
#----------------------------------------
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
#----------------------------------------
#Delete via ID
#----------------------------------------
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
