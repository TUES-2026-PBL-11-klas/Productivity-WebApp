from fastapi import FastAPI
from database import engine
import models
from routers import auth, workspaces
from setup_db import init_database

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    init_database()

app.include_router(auth.router)
app.include_router(workspaces.router)