from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import pdfkit
import os
from jinja2 import Template

options = {
    'no-outline': None,    # Bez obramowania
    'encoding': 'UTF-8'    # Ustawienie kodowania na UTF-8
}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://cv-pdf-generator.netlify.app"],  # Pozwól na dostęp z tego portu
    allow_credentials=True,
    allow_methods=["*"],  # Pozwól na wszystkie metody (GET, POST, itp.)
    allow_headers=["*"],  # Pozwól na wszystkie nagłówki
)

class CVData(BaseModel):
    name: str
    email: str
    phone: str
    summary: str
    experience: list
    skills: list
    projects: list

TEMPLATE_PATH = "templates/cv-template.html"

@app.post("/generate_cv/")
def generate_cv(data: CVData):
    try:
        with open(TEMPLATE_PATH, "r", encoding="utf-8") as file:
            template = Template(file.read())

        html_content = template.render(
            name=data.name, email=data.email, phone=data.phone, summary=data.summary,
            experience=data.experience, skills=data.skills, projects=data.projects
        )

        file_path = "generated_cv.pdf"

        pdfkit.from_string(html_content, file_path, options=options)

        return FileResponse(file_path, media_type="application/pdf", filename="generated_cv.pdf")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
