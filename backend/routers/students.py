from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_connection ,filter_hidden
from datetime import date
import json

router = APIRouter()

class Student(BaseModel):
    STD_STUDENTNAME: str
    STD_CLASS: str
    STD_SECTION: str
    STD_MOBILE: str
    STD_ADMISSIONDATE: date
    STD_CLS_DOCNO: str
    STD_SEC_DOCNO: str

def get_next_docno(cursor):
    cursor.execute("""
        SELECT TOP 1 STD_DOCNO 
        FROM STUDENT_MASTER 
        WHERE STD_DOCTYPE = 'STU'
        ORDER BY STD_DOCNO DESC
    """)
    row = cursor.fetchone()
    if row is None:
        return "STU-0001"
    last = row[0]
    num = int(last.split("-")[1]) + 1
    return f"STU-{num:04d}"

# ADD STUDENT
@router.post("/students/")
def add_student(student: Student):
    conn = get_connection()
    cursor = conn.cursor()
    docno = get_next_docno(cursor)
    
    # Convert student data to JSON
    student_json = json.dumps(student.model_dump(), default=str)
    
    cursor.execute("EXEC usp_Add_Student @STD_DOCNO=?, @JSON=?",
                   (docno, student_json))
    conn.commit()
    conn.close()
    return {"message": "Student added successfully", "STD_DOCNO": docno}
# @router.post("/students/")
# def add_student(student: Student):
#     conn = get_connection()
#     cursor = conn.cursor()
#     docno = get_next_docno(cursor)
#     cursor.execute("""
#         INSERT INTO STUDENT_MASTER 
#         (STD_DOCTYPE, STD_DOCNO, STD_STUDENTNAME, STD_CLASS, STD_SECTION, 
#          STD_MOBILE, STD_ADMISSIONDATE, STD_CLS_DOCNO, STD_SEC_DOCNO)
#         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
#     """, ('STU', docno, student.STD_STUDENTNAME, student.STD_CLASS,
#           student.STD_SECTION, student.STD_MOBILE, student.STD_ADMISSIONDATE,
#           student.STD_CLS_DOCNO, student.STD_SEC_DOCNO))
#     conn.commit()
#     conn.close()
#     return {"message": "Student added successfully", "STD_DOCNO": docno}

# GET ALL STUDENTS
# @router.get("/students/")
# def get_students():
#     conn = get_connection()
#     cursor = conn.cursor()
#     cursor.execute("""
#         SELECT S.STD_DOCTYPE, S.STD_DOCNO, S.STD_STUDENTNAME, 
#                C.CLS_NAME, SEC.SEC_NAME, S.STD_MOBILE, 
#                S.STD_ADMISSIONDATE, S.STD_CLS_DOCNO, S.STD_SEC_DOCNO
#         FROM STUDENT_MASTER S
#         INNER JOIN CLASS_MASTER C ON
#                 S.STD_CLS_DOCNO = C.CLS_DOCNO
#         INNER JOIN SECTION_MASTER SEC ON
#                 S.STD_SEC_DOCNO = SEC.SEC_DOCNO
#         WHERE S.STD_ISACTIVE = 1
#     """)
#     rows = cursor.fetchall()
#     conn.close()
#     students = []
#     for row in rows:
#         students.append({
#             "STD_DOCTYPE": row[0],
#             "STD_DOCNO": row[1],
#             "STD_STUDENTNAME": row[2],
#             "STD_CLASS": row[3],
#             "STD_SECTION": row[4],
#             "STD_MOBILE": row[5],
#             "STD_ADMISSIONDATE": str(row[6]),
#             "STD_CLS_DOCNO": row[7],
#             "STD_SEC_DOCNO": row[8]
#         })
#     return students

@router.get("/students/")
def get_students():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("EXEC usp_Get_Students")
    result = filter_hidden(cursor)
    conn.close()
    return result

# GET SINGLE STUDENT
@router.get("/students/{docno}")
def get_student(docno: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT STD_DOCTYPE, STD_DOCNO, STD_STUDENTNAME,
               STD_CLASS, STD_SECTION, STD_MOBILE, 
               STD_ADMISSIONDATE, STD_CLS_DOCNO, STD_SEC_DOCNO
        FROM STUDENT_MASTER
        WHERE STD_DOCNO = ? AND STD_ISACTIVE = 1
    """, (docno,))
    row = cursor.fetchone()
    conn.close()
    if row is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return {
        "STD_DOCTYPE": row[0],
        "STD_DOCNO": row[1],
        "STD_STUDENTNAME": row[2],
        "STD_CLASS": row[3],
        "STD_SECTION": row[4],
        "STD_MOBILE": row[5],
        "STD_ADMISSIONDATE": str(row[6]),
        "STD_CLS_DOCNO": row[7],
        "STD_SEC_DOCNO": row[8]
    }

# UPDATE STUDENT
@router.put("/students/{docno}")
def update_student(docno: str, student: Student):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE STUDENT_MASTER
        SET STD_STUDENTNAME = ?,
            STD_CLASS = ?,
            STD_SECTION = ?,
            STD_MOBILE = ?,
            STD_ADMISSIONDATE = ?,
            STD_CLS_DOCNO = ?,
            STD_SEC_DOCNO = ?
        WHERE STD_DOCNO = ?
    """, (student.STD_STUDENTNAME, student.STD_CLASS,
          student.STD_SECTION, student.STD_MOBILE,
          student.STD_ADMISSIONDATE, student.STD_CLS_DOCNO,
          student.STD_SEC_DOCNO, docno))
    conn.commit()
    conn.close()
    return {"message": "Student updated successfully"}

# DELETE STUDENT (Soft Delete)
@router.delete("/students/{docno}")
def delete_student(docno: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE STUDENT_MASTER
        SET STD_ISACTIVE = 0
        WHERE STD_DOCNO = ?
    """, (docno,))
    conn.commit()
    conn.close()
    return {"message": "Student deleted successfully"}