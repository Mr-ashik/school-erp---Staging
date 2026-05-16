import pyodbc

def get_connection():
    conn = pyodbc.connect(
        "DRIVER={ODBC Driver 17 for SQL Server};"
        "SERVER=MOHAMMAD-HASHIK\\SQLEXPRESS;"
        "DATABASE=SchoolERP;"
        "Trusted_Connection=yes;"
    )
    return conn