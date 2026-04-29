from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

app.mount("/static", StaticFiles(directory="frontend"), name="static")

templates = Jinja2Templates(directory="frontend")

@app.get("/")
async def read_index(request: Request):
    # En lugar de un diccionario complejo, usamos argumentos con nombre si es necesario
    return templates.TemplateResponse(
        request=request, 
        name="index.html", 
        context={} # Aquí puedes meter tus datos del CRUD más adelante
    )