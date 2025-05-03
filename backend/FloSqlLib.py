import os
import sys

from flask_mysqldb import MySQL

from config import db_config
import traceback

def main():
    """Main function for testing or standalone execution."""
    print("FloSqlLib module loaded successfully.")
class SQLManager:
    def __init__(self, app):
        for key, value in db_config.items():
            app.config[key] = value
            print (f"Configuring {key} with value: {value}")
        self._mysql = MySQL(app)
        self._ContactColumns = "error"

    def get_Columns(self, table_name):
        if(self._ContactColumns != "error" and table_name == "contacts"):
            return self._ContactColumns
        else:
            try:
                cursor = self._mysql.connection.cursor()
                cursor.execute("""
                    SELECT COLUMN_NAME 
                    FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = %s
                """, (table_name,))
                columns = [row[0] for row in cursor.fetchall()]
                cursor.close()
                return columns
            except Exception as e:
                print(f"Error: {e}")
                return []
        
    def get_Contacts(self, projection, selection):
        print(f"Projection: {projection}")
        print(f"Selection: {selection}")
        
        # Ensure that the projection fields are valid column names
        valid_columns = self.get_Columns("contacts")
        valid_columns.append("*") # List of valid column names for projection
        for col in projection:
            if col not in valid_columns:
                raise ValueError(f"Invalid column name: {col}")
        
        try:
            cursor = self._mysql.connection.cursor()
            if projection == ['*']:
                projection = self.get_Columns("contacts")
            projstring = ", ".join(projection) 
            sql_query = f"SELECT {projstring} FROM contacts"
            
            # Handle selection with parameterized queries
            params = []
            if selection != ['*']:
                # Build WHERE clause dynamically but safely
                conditions = []
                for cond in selection:
                    # Assuming each condition is in the form of 'column_name operator value'
                    column, operator, value = cond.split(' ', 2)
                    # Validate column name and operator
                    if column not in valid_columns:
                        raise ValueError(f"Invalid column name in selection: {column}")
                    # Add the condition to the list
                    conditions.append(f"{column} {operator} %s")
                    params.append(value)  # We use %s placeholders for parameters
                
                # Add WHERE clause with conditions
                sql_query += " WHERE " + " AND ".join(conditions)
                        
            # Execute the query with parameters (prevents SQL injection)
            cursor.execute(sql_query, params)
            rows = cursor.fetchall()
            
            contacts = []
            for row in rows:
                temp = {}
                for index, col in enumerate(projection):
                    temp[col] = row[index]
                contacts.append(temp)
                
            return contacts
        
        except Exception as e:
            exc_type, exc_value, exc_traceback = sys.exc_info()
            line_number = traceback.extract_tb(exc_traceback)[-1].lineno
            print(f"Error: {e} on line {line_number}.")
            return []
    def add_Contact(self, data):
        valid_columns = self.get_Columns("contacts")
        help = []
        for col in data:
            help.append(col)
            if col not in valid_columns:
                raise ValueError(f"Invalid column name: {col}")
        cursor = self._mysql.connection.cursor()
        cursor.execute(
            f"INSERT INTO contacts ({", ".join(help)}) VALUES ({', '.join(['%s'] * len(help))})",
            (val for col, val in data.items())
        )
        self._mysql.connection.commit()
    def delete_Contact(self, contact_id):
        cursor = self._mysql.connection.cursor()
        cursor.execute("DELETE FROM contacts WHERE id = %s", (contact_id,))
        self._mysql.connection.commit()
if __name__ == "__main__":
    main()