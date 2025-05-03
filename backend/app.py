from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL  # Updated import
from config import db_config
from FloSqlLib import SQLManager
app = Flask(__name__)
CORS(app)  # Allow frontend to connect

# DB Configuration
for key, value in db_config.items():
    app.config[key] = value
    print (f"Configuring {key} with value: {value}")
# mysql = MySQL(app)
MyOwnSQL = SQLManager(app)  # Create a separate instance for MyOwnSQL if needed
#----------------------------------------
#Get Contacts via SQL
#----------------------------------------
@app.route("/contacts", methods=["GET"])
def get_contacts():
    projection = request.args.get("proj")
    selection = request.args.get("sel")
    if not selection:
        selection = "*"
    if not projection:
        projection = "*"
    ret = MyOwnSQL.get_Contacts(projection.split(";"), selection.split(";"))
    if ret == "error":
        return jsonify({"error": "Error in SQL query"}), 400
    else:
        return jsonify(ret), 200

#----------------------------------------
#Get Columns via SQL
#----------------------------------------
@app.route("/getColumns", methods=["GET"])
def get_Columns():
    table_name = request.args.get("table_name")
    if not table_name:
        return jsonify({"error": "Missing table_name"}), 400
    return jsonify(MyOwnSQL.get_Columns(table_name))
#----------------------------------------
#Add a new contact
#----------------------------------------
@app.route("/contacts", methods=["POST"])
def add_contact():
    data = request.get_json()
    MyOwnSQL.add_Contact(data)
    return jsonify({"message": "Contact added"}), 201
#----------------------------------------
#Delete via ID
#----------------------------------------
@app.route("/contacts/del/<int:contact_id>", methods=["DELETE"])
def delete_contact(contact_id):
    if request.method == "OPTIONS":
        # Handle preflight request
        return jsonify({"message": "Preflight request successful"}), 200
    MyOwnSQL.delete_Contact(contact_id)
    return jsonify({"message": "Contact deleted"}), 200

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)  # Run the app on all interfaces and port 5000
