from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import students

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(students.router)

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

    conn.close()

    return {
        "total_students": total_students,
        "total_staff": 0,
        "fees_collected": 0,
        "today_attendance": 0
    }