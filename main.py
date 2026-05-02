from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
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

templates = Jinja2Templates(directory="frontend")

@app.get("/")
async def read_index(request: Request):
    return templates.TemplateResponse(
        request=request, 
        name="auth/login/login.html", 
        context={}
    )

@app.get("/auth")
async def read_index(request: Request):
    return templates.TemplateResponse(
        request=request, 
        name="auth/auth.html", 
        context={}
    )

@app.get("/form")
async def read_index(request: Request):
    return templates.TemplateResponse(
        request=request, 
        name="/form/index.html", 
        context={}
    )

@app.get("/form/edit")
async def read_index(request: Request):
    return templates.TemplateResponse(
        request=request, 
        name="/form/edit/index.html", 
        context={}
    )

@app.get("/view-list")
async def read_view_list(request: Request):
    return templates.TemplateResponse(
        request=request, 
        name="view-list/index.html", 
        context={}
        )