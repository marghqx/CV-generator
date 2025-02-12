from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
import pdfkit
import os
from jinja2 import Template

app = FastAPI()

class CVData(BaseModel):
    name: str
    email: str
    phone: str
    summary: str
    experience: list
    skills: list
    projects: list

# Ścieżka do szablonu HTML
TEMPLATE_PATH = "templates/cv_template.html"

@app.post("/generate_cv/")
def generate_cv(data: CVData):
    try:
        # Wczytanie szablonu HTML
        with open(TEMPLATE_PATH, "r", encoding="utf-8") as file:
            template = Template(file.read())

        # Wypełnienie szablonu danymi użytkownika
        html_content = template.render(
            name=data.name, email=data.email, phone=data.phone, summary=data.summary,
            experience=data.experience, skills=data.skills, projects=data.projects
        )

        # Ścieżka do wygenerowanego pliku PDF
        file_path = "generated_cv.pdf"

        # Generowanie PDF-a
        pdfkit.from_string(html_content, file_path)

        return FileResponse(file_path, media_type="application/pdf", filename="generated_cv.pdf")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
