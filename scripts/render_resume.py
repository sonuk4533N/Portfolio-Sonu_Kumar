from pathlib import Path

import pdfplumber
import pypdfium2 as pdfium
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
PDF_PATH = ROOT / "output" / "pdf" / "Sonu_Kumar_Resume.pdf"
RENDER_DIR = ROOT / "tmp" / "pdfs"
RENDER_DIR.mkdir(parents=True, exist_ok=True)

reader = PdfReader(str(PDF_PATH))
if len(reader.pages) != 1:
    raise RuntimeError(f"Expected one page, found {len(reader.pages)}")

with pdfplumber.open(str(PDF_PATH)) as pdf:
    extracted = "\n".join(page.extract_text() or "" for page in pdf.pages)

required_text = [
    "SONU KUMAR",
    "FULL-STACK DEVELOPER",
    "Freelance Web Developer",
    "Selected Projects",
    "Bachelor of Computer Application",
]
missing = [item for item in required_text if item.lower() not in extracted.lower()]
if missing:
    raise RuntimeError(f"Missing expected PDF text: {missing}")

document = pdfium.PdfDocument(str(PDF_PATH))
for page_number in range(len(document)):
    page = document[page_number]
    bitmap = page.render(scale=2.2)
    image = bitmap.to_pil()
    output = RENDER_DIR / f"resume-page-{page_number + 1}.png"
    image.save(output)
    print(output)

print(f"PAGES={len(reader.pages)}")
print(f"TEXT_CHARS={len(extracted)}")
