from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import students,  attendance, masters

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(students.router)
app.include_router(attendance.router)
app.include_router(masters.router)

@app.get("/")
def read_root():
    return {"message": "School ERP API is running!"}

@app.get("/dashboard/")
def get_dashboard():
    from database import get_connection
    conn = get_connection()
    cursor = conn.cursor()

    # Total Students
    cursor.execute("SELECT COUNT(*) FROM StudentMaster WHERE STD_ISACTIVE = 1")
    total_students = cursor.fetchone()[0]

    # Today's Attendance
    cursor.execute("""
        SELECT COUNT(DISTINCT ATT_STD_DOCNO) 
        FROM ATTENDANCEMASTER 
        WHERE ATT_DATE = CAST(GETDATE() AS DATE)
        AND ATT_ISACTIVE = 1
    """)
    today_attendance = cursor.fetchone()[0]

    conn.close()

    return {
        "total_students": total_students,
        "total_staff": 0,
        "fees_collected": 0,
        "today_attendance": today_attendance
    }