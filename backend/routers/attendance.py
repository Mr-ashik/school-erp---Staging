from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_connection
from datetime import date
from typing import List

router = APIRouter()

# Model for single attendance record
class AttendanceRecord(BaseModel):
    ATT_STD_DOCNO: str
    ATT_STD_NAME: str
    ATT_CLASS: str
    ATT_SECTION: str
    ATT_STATUS: str  # P, A, L
    ATT_REMARKS: str = ""

# Model for full attendance submission
class AttendanceSubmit(BaseModel):
    ATT_DATE: date
    ATT_SES_DOCNO: str
    records: List[AttendanceRecord]

# Auto generate next ATT_DOCNO
def get_next_docno(cursor):
    cursor.execute("""
        SELECT TOP 1 ATT_DOCNO 
        FROM ATTENDANCEMASTER
        WHERE ATT_DOCTYPE = 'ATT'
        ORDER BY ATT_DOCNO DESC
    """)
    row = cursor.fetchone()
    if row is None:
        return "ATT-0001"
    last = row[0]
    num = int(last.split("-")[1]) + 1
    return f"ATT-{num:04d}"

# GET ALL SESSIONS
@router.get("/sessions/")
def get_sessions():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT SES_DOCNO, SES_NAME 
        FROM SESSION_MASTER 
        WHERE SES_ISACTIVE = 1
    """)
    rows = cursor.fetchall()
    conn.close()
    return [{"SES_DOCNO": row[0], "SES_NAME": row[1]} for row in rows]

# GET STUDENTS BY CLASS AND SECTION
@router.get("/attendance/students/")
def get_students_by_class(cls: str, section: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT STD_DOCNO, STD_STUDENTNAME, STD_CLASS, STD_SECTION
        FROM StudentMaster
        WHERE STD_CLASS = ? AND STD_SECTION = ? AND STD_ISACTIVE = 1
    """, (cls, section))
    rows = cursor.fetchall()
    conn.close()
    return [{"STD_DOCNO": row[0], "STD_STUDENTNAME": row[1],
             "STD_CLASS": row[2], "STD_SECTION": row[3]} for row in rows]

# MARK ATTENDANCE
@router.post("/attendance/")
def mark_attendance(data: AttendanceSubmit):
    conn = get_connection()
    cursor = conn.cursor()
    for record in data.records:
        # Check if already marked
        cursor.execute("""
            SELECT COUNT(*) FROM ATTENDANCEMASTER
            WHERE ATT_DATE = ? AND ATT_SES_DOCNO = ? AND ATT_STD_DOCNO = ?
        """, (data.ATT_DATE, data.ATT_SES_DOCNO, record.ATT_STD_DOCNO))
        exists = cursor.fetchone()[0]
        if exists:
            continue  # Skip already marked
        docno = get_next_docno(cursor)
        cursor.execute("""
            INSERT INTO ATTENDANCEMASTER
            (ATT_DOCTYPE, ATT_DOCNO, ATT_DATE, ATT_SES_DOCNO, ATT_STD_DOCNO,
             ATT_STD_NAME, ATT_CLASS, ATT_SECTION, ATT_STATUS, ATT_REMARKS)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, ('ATT', docno, data.ATT_DATE, data.ATT_SES_DOCNO,
              record.ATT_STD_DOCNO, record.ATT_STD_NAME,
              record.ATT_CLASS, record.ATT_SECTION,
              record.ATT_STATUS, record.ATT_REMARKS))
    conn.commit()
    conn.close()
    return {"message": "Attendance marked successfully"}

# GET ATTENDANCE REPORT
@router.get("/attendance/report/")
def get_attendance_report(cls: str, section: str, att_date: date):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT A.ATT_STD_DOCNO, A.ATT_STD_NAME, A.ATT_STATUS, 
               A.ATT_REMARKS, S.SES_NAME
        FROM ATTENDANCEMASTER A
        JOIN SESSION_MASTER S ON A.ATT_SES_DOCNO = S.SES_DOCNO
        WHERE A.ATT_CLASS = ? AND A.ATT_SECTION = ? AND A.ATT_DATE = ?
        AND A.ATT_ISACTIVE = 1
    """, (cls, section, att_date))
    rows = cursor.fetchall()
    conn.close()
    return [{"STD_DOCNO": row[0], "STD_NAME": row[1],
             "STATUS": row[2], "REMARKS": row[3],
             "SESSION": row[4]} for row in rows]