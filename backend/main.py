from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from jinja2 import Environment, FileSystemLoader
import openai
import pdfkit
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Geliştirirken * qoymaq olar, productionda daha məhdudlaşdır
    allow_methods=["*"],
    allow_headers=["*"],
)

openai.api_key = "OPENAI_API_KEYİNİ_BURAYA_YAZ"  # OpenAI API açarını buraya qoy

# Jinja2 template mühiti
templates_dir = os.path.join(os.path.dirname(__file__), "templates")
jinja_env = Environment(loader=FileSystemLoader(templates_dir))


@app.post("/optimize-cv/")
async def optimize_cv(name: str = Form(...), raw_cv: str = Form(...)):
    prompt = f"Optimize this CV for a developer job application:\n\n{raw_cv}"
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=500,
        temperature=0.7,
    )
    optimized_cv = response.choices[0].text.strip()

    template = jinja_env.get_template("cv_template.html")
    html_out = template.render(name=name, optimized_cv=optimized_cv)

    pdfkit.from_string(html_out, "output.pdf")

    return {
        "optimized_cv": optimized_cv,
        "pdf_url": "/download-cv"
    }


@app.get("/download-cv")
async def download_cv():
    return FileResponse("output.pdf", media_type="application/pdf", filename="optimized_cv.pdf")
