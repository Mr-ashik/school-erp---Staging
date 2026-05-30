from fastapi import APIRouter
from database import get_connection, filter_hidden, get_all

router = APIRouter()

# GET ALL CLASSES
@router.get("/classes/")
def get_classes():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT CLS_DOCNO, CLS_NAME 
        FROM CLASS_MASTER 
        WHERE CLS_ISACTIVE = 1
        ORDER BY CLS_NAME
    """)
    rows = cursor.fetchall()
    conn.close()
    return [{"CLS_DOCNO": row[0], "CLS_NAME": row[1]} for row in rows]

# GET ALL SECTIONS
@router.get("/sections/")
def get_sections():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT SEC_DOCNO, SEC_NAME 
        FROM SECTION_MASTER 
        WHERE SEC_ISACTIVE = 1
        ORDER BY SEC_NAME
    """)
    rows = cursor.fetchall()
    conn.close()
    return [{"SEC_DOCNO": row[0], "SEC_NAME": row[1]} for row in rows]

@router.post("/sync-lastno/")
def sync_lastno(data: dict):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("EXEC usp_Update_LastNo @DOCTYPE=?", (data['DOCTYPE'],))
    result = get_all(cursor)
    conn.commit()
    conn.close()
    return result

# @router.get("/lastnos/")
# def get_lastnos():
#     conn = get_connection()
#     cursor = conn.cursor()
#     cursor.execute("SELECT * FROM LASTNO_MASTER WHERE LNO_ISACTIVE = 1")
#     result = get_all(cursor)
#     conn.close()
#     return result

@router.get("/lastno-status/")
def get_lastno_status():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("EXEC usp_Get_LastNo_Status")
    result = get_all(cursor)
    conn.close()
    return result