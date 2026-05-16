from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_connection
from datetime import date

router = APIRouter()

# This defines what data we expect when adding a student
class Student(BaseModel):
    STD_STUDENTNAME: str
    STD_CLASS: str
    STD_SECTION: str
    STD_MOBILE: str
    STD_ADMISSIONDATE: date

# Auto generate next document number (STU-0001, STU-0002...)
def get_next_docno(cursor):
    cursor.execute("""
        SELECT TOP 1 STD_DOCNO 
        FROM StudentMaster 
        WHERE STD_DOCTYPE = 'STU'
        ORDER BY STD_DOCNO DESC
    """)
    row = cursor.fetchone()
    if row is None:
        return "STU-0001"
    last = row[0]  # e.g. STU-0005
    num = int(last.split("-")[1]) + 1
    return f"STU-{num:04d}"

# ADD STUDENT
@router.post("/students/")
def add_student(student: Student):
    conn = get_connection()
    cursor = conn.cursor()
    docno = get_next_docno(cursor)
    cursor.execute("""
        INSERT INTO StudentMaster 
        (STD_DOCTYPE, STD_DOCNO, STD_STUDENTNAME, STD_CLASS, STD_SECTION, STD_MOBILE, STD_ADMISSIONDATE)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, ('STU', docno, student.STD_STUDENTNAME, student.STD_CLASS, 
          student.STD_SECTION, student.STD_MOBILE, student.STD_ADMISSIONDATE))
    conn.commit()
    conn.close()
    return {"message": "Student added successfully", "STD_DOCNO": docno}

# GET ALL STUDENTS
@router.get("/students/")
def get_students():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT STD_DOCTYPE, STD_DOCNO, STD_STUDENTNAME, 
               STD_CLASS, STD_SECTION, STD_MOBILE, STD_ADMISSIONDATE 
        FROM StudentMaster 
        WHERE STD_ISACTIVE = 1
    """)
    rows = cursor.fetchall()
    conn.close()
    students = []
    for row in rows:
        students.append({
            "STD_DOCTYPE": row[0],
            "STD_DOCNO": row[1],
            "STD_STUDENTNAME": row[2],
            "STD_CLASS": row[3],
            "STD_SECTION": row[4],
            "STD_MOBILE": row[5],
            "STD_ADMISSIONDATE": str(row[6])
        })
    return students

# GET SINGLE STUDENT
@router.get("/students/{docno}")
def get_student(docno: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT STD_DOCTYPE, STD_DOCNO, STD_STUDENTNAME,
               STD_CLASS, STD_SECTION, STD_MOBILE, STD_ADMISSIONDATE
        FROM StudentMaster
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
        "STD_ADMISSIONDATE": str(row[6])
    }

# UPDATE STUDENT
@router.put("/students/{docno}")
def update_student(docno: str, student: Student):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE StudentMaster
        SET STD_STUDENTNAME = ?,
            STD_CLASS = ?,
            STD_SECTION = ?,
            STD_MOBILE = ?,
            STD_ADMISSIONDATE = ?
        WHERE STD_DOCNO = ?
    """, (student.STD_STUDENTNAME, student.STD_CLASS,
          student.STD_SECTION, student.STD_MOBILE,
          student.STD_ADMISSIONDATE, docno))
    conn.commit()
    conn.close()
    return {"message": "Student updated successfully"}

# DELETE STUDENT (Soft Delete)
@router.delete("/students/{docno}")
def delete_student(docno: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE StudentMaster
        SET STD_ISACTIVE = 0
        WHERE STD_DOCNO = ?
    """, (docno,))
    conn.commit()
    conn.close()
    return {"message": "Student deleted successfully"}