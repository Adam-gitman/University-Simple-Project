from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from routes import students, auth
from database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(students.router)
app.include_router(auth.router)
app.mount("/static", StaticFiles(directory="frontend"), name="static")

@app.get("/")
def index():
    return FileResponse("frontend/login.html")

@app.get("/auth.html")
def auth_page():
    return FileResponse("frontend/auth.html")

@app.get("/index.html")
def home():
    return FileResponse("frontend/index.html")

@app.get("/view-list")
def view_list():
    return FileResponse("frontend/view-list/index.html")