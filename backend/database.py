import pyodbc

def get_connection():
    conn = pyodbc.connect(
        "DRIVER={ODBC Driver 17 for SQL Server};"
        "SERVER=MOHAMMAD-HASHIK\\SQLEXPRESS;"
        "DATABASE=SchoolERP;"
        "Trusted_Connection=yes;"
    )
    return conn

def filter_hidden(cursor):
    columns = [column[0] for column in cursor.description]
    rows = cursor.fetchall()
    result = []
    for row in rows:
        full_row = dict(zip(columns, row))
        filtered_row = {k: v for k, v in full_row.items()
                       if not k.endswith('_hidden')}
        result.append(filtered_row)
    return result