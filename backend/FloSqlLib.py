import os
import sys
from datetime import datetime

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
        self._RelationColumns = "error"

    def get_Columns(self, table_name):
        # Return cached result if it's already loaded and table is 'contacts'
        if self._ContactColumns != "error" and table_name == "contacts":
            return self._ContactColumns
        if self._RelationColumns != "error" and table_name == "relations":
            return self._RelationColumns

        try:
            cursor = self._mysql.connection.cursor()

            # Fetch column name and full type
            cursor.execute("""
                SELECT COLUMN_NAME, COLUMN_TYPE
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = %s
            """, (table_name,))
            
            results = cursor.fetchall()
            cursor.close()

            # Build dictionary while skipping hidden columns
            columns = {
                col_name: col_type  
                for col_name, col_type in results
                if not col_name.endswith("_h")
            }

            # Optionally cache for contacts table
            if table_name == "contacts":
                self._ContactColumns = columns
            if table_name == "relations":
                self._RelationColumns = columns
            return columns

        except Exception as e:
            print(f"Error: {e}")
            return {}

    def get_Rows(self, table_name, projection, selection):
        print(f"Projection: {projection}")
        print(f"Selection: {selection}")
        
        # Ensure that the projection fields are valid column names
        valid_columns = list(self.get_Columns(table_name).keys())
        valid_columns.append("*") # List of valid column names for projection
        for col in projection:
            if col not in valid_columns:
                raise ValueError(f"Invalid column name: {col}")
        
        try:
            cursor = self._mysql.connection.cursor()
            if projection == ['*']:
                projection = list(self.get_Columns(table_name).keys())
            projstring = ", ".join(projection) 
            sql_query = f"SELECT {projstring} FROM " + str(table_name)
            
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
            print(f"Contacts: {(sql_query, params)}")

            rows = cursor.fetchall()
            
            contacts = []
            for row in rows:
                temp = {}
                for index, col in enumerate(projection):
                    temp[col] = row[index]
                contacts.append(temp)
            if len(contacts) == 0:
                print("No contacts found.")
                return [{'error': 'No contacts found.'}]
            return contacts
        
        except Exception as e:
            exc_type, exc_value, exc_traceback = sys.exc_info()
            line_number = traceback.extract_tb(exc_traceback)[-1].lineno
            print(f"Error: {e} on line {line_number}.")
            return []
        
    def add_Contact(self, table_name, data):
        print(f"Adding {table_name} with data: {data}")
        valid_columns = list(self.get_Columns(table_name).keys())
        columnsToAdd = []
        for col in data:
            if col not in valid_columns:
                raise ValueError(f"Invalid column name: {col}")
            elif data[col] != '' and col != "id":
                if(col == "created_at"):
                        dt = datetime.strptime(data[col], "%a, %d %b %Y %H:%M:%S GMT")
                        data[col] = dt.strftime("%Y-%m-%d %H:%M:%S")
                columnsToAdd.append(col)
        cursor = self._mysql.connection.cursor()
        columns = ", ".join(columnsToAdd)
        theSes = ', '.join(['%s'] * len(columnsToAdd))
        Data = list(data[col] for col in columnsToAdd)
        #Data = list(Data).insert(0, table_name)
        print(f"INSERT INTO {table_name} ({columns}) VALUES ({theSes})")
        for val in Data:
            print(f"Data:  {val}")

        cursor.execute(
            f"INSERT INTO {table_name} ({columns}) VALUES ({theSes})",
            Data
        )
        self._mysql.connection.commit()


    def delete_Contact(self, table_name, contact_id):
        cursor = self._mysql.connection.cursor()
        cursor.execute(f"DELETE FROM {table_name} WHERE id = %s", (contact_id,))
        self._mysql.connection.commit()

    def update_Contact(self, table_name, contact_id, data):
        try:
            print(f"Updataing {table_name} {contact_id} with data: {data}")
            valid_columns = list(self.get_Columns(table_name).keys())
            help = []
            for col in data:
                if col not in valid_columns:
                    raise ValueError(f"Invalid column name: {col}")
                elif col != "id": #data[col] != '' and
                    if(data[col] and self.get_Columns(table_name)[col] == "date"):
                        dt = datetime.strptime(data[col], "%a, %d %b %Y %H:%M:%S GMT")
                        data[col] = dt.strftime("%Y-%m-%d")
                    help.append(col)
            cursor = self._mysql.connection.cursor()
            Data = (data[col] for col in help)
            set_clause = ", ".join([f"{col} = %s" for col in help])
            Data = list(Data) + [contact_id]  # Append contact_id for WHERE clause
            print(f"UPDATE contacts SET {set_clause} WHERE id = %s",
                Data)
            cursor.execute(
                f"UPDATE contacts SET {set_clause} WHERE id = %s",
                Data
            )
            self._mysql.connection.commit()
        except Exception as e:
            exc_type, exc_value, exc_traceback = sys.exc_info()
            line_number = traceback.extract_tb(exc_traceback)[-1].lineno
            print(f"Error: {e} on line {line_number}.")
            return []
if __name__ == "__main__":
    main()