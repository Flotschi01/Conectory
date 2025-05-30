from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL  # Updated import
from config import db_config
from FloSqlLib import SQLManager
app = Flask(__name__)
CORS(app, supports_credentials=True)  # Allow frontend to connect

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
def get_rows():
    projection = request.args.get("proj") or "*" # if proj is not defined, use "*"
    selection = request.args.get("sel") or "*"
    ret = MyOwnSQL.get_Rows("contacts",projection.split(";"), selection.split(";"))
    return jsonify(ret), 200



@app.route("/relations", methods=["GET"])
def get_rel():
    projection = request.args.get("proj") or "*" # if proj is not defined, use "*"
    selection = request.args.get("sel") or "*"
    ret = MyOwnSQL.get_Rows("relations",projection.split(";"), selection.split(";"))
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
    MyOwnSQL.add_Contact("contacts", request.get_json())
    return jsonify({"message": "Contact added"}), 201

@app.route("/relations", methods=["POST"])
def add_relation():
    data = request.get_json()
    if(data["person1_id"] > data["person2_id"]):
        data["person1_id"], data["person2_id"] = data["person2_id"], data["person1_id"]
    MyOwnSQL.add_Contact("relations", data)
    return jsonify({"message": "Contact added"}), 201
#----------------------------------------
#Delete via ID
#----------------------------------------
@app.route("/contacts/<int:contact_id>", methods=["DELETE", "OPTIONS"])
def delete_contact(contact_id):
    if request.method == "OPTIONS":
        return '', 200  # allow preflight
    MyOwnSQL.delete_Contact("contacts",contact_id)
    return jsonify({"message": "Contact deleted"}), 200

@app.route("/relations/<int:relation_id>", methods=["DELETE", "OPTIONS"])
def delete_relation(relation_id):
    if request.method == "OPTIONS":
        return '', 200  # allow preflight
    MyOwnSQL.delete_Contact("relations", relation_id)
    return jsonify({"message": "Contact deleted"}), 200
#----------------------------------------
#Update via ID
#----------------------------------------
@app.route("/contacts/update/<int:ucontact_id>", methods=["POST"])
def update_Contact(ucontact_id):
    MyOwnSQL.update_Contact("contacts", ucontact_id, request.get_json())
    return jsonify({"message": "Updated Contact:" + str(ucontact_id)}), 200
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)  # Run the app on all interfaces and port 5000
