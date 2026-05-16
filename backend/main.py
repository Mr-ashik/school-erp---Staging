from fastapi import FastAPI
from routers import students

app = FastAPI()

app.include_router(students.router)

@app.get("/")
def read_root():
    return {"message": "School ERP API is running!"}