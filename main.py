from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import students, auth
from database import engine, Base

# Crea las tablas en la base de datos al iniciar
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="University API",
    description="API para la gestión de estudiantes",
    version="1.0.0"
)

# CONFIGURACIÓN DE CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://estudiantes-web-lwcp.onrender.com", # Tu URL de producción
        "http://localhost:5173",                     
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# RUTAS DE LA API
app.include_router(students.router, tags=["Students"])
app.include_router(auth.router, tags=["Auth"])

@app.get("/")
async def root():
    """
    Ruta de verificación para saber que el backend está funcionando.
    """
    return {
        "status": "online",
        "message": "University API is running",
        "frontend_allowed": "https://estudiantes-web-lwcp.onrender.com",
        "docs": "/docs"
    }