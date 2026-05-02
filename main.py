from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

app.mount("/static", StaticFiles(directory="frontend"), name="static")

templates = Jinja2Templates(directory="frontend")

@app.get("/")
async def read_index(request: Request):
    return templates.TemplateResponse(
        request=request, 
        name="index.html", 
        context={}
    )

@app.get("/view-list")
async def read_view_list(request: Request):
    return templates.TemplateResponse(
        request=request, 
        name="view-list/index.html", 
        context={}
        )