import pyodbc

def get_connection():
    conn = pyodbc.connect(
        "DRIVER={ODBC Driver 17 for SQL Server};"
        "SERVER=MOHAMMAD-HASHIK\\SQLEXPRESS;"
        "DATABASE=SchoolERP;"
        "Trusted_Connection=yes;"
    )
    return conn

# def get_next_docno(cursor, doctype):
#     cursor.execute("EXEC usp_Get_Next_DocNo @DOCTYPE=?", (doctype,))
#     cursor.nextset()
#     row = cursor.fetchone()
#     return row[0]


def get_next_docno(cursor, doctype):
    cursor.execute("{CALL usp_Get_Next_DocNo (?)}", (doctype,))
    row = cursor.fetchone()
    return row[0]

def normalize_keys(row_dict):
    return {k.upper(): v for k, v in row_dict.items()}

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

def get_all(cursor):
    columns = [column[0] for column in cursor.description]
    rows = cursor.fetchall()
    return [
        {k.upper(): v for k, v in dict(zip(columns, row)).items()}
        for row in rows
    ]