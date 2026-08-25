from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "Sonu_Kumar_Resume.pdf"

PAGE_W, PAGE_H = A4
NAVY = HexColor("#0B1020")
PURPLE = HexColor("#7C3AED")
CYAN = HexColor("#22D3EE")
INK = HexColor("#151827")
MUTED = HexColor("#5C6375")
LIGHT = HexColor("#EEF1F8")
WHITE = HexColor("#FFFFFF")


def wrap(text, font, size, width):
    words = text.split()
    lines = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if stringWidth(candidate, font, size) <= width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_wrapped(c, text, x, y, width, font="Helvetica", size=8.5, leading=11, color=INK):
    c.setFont(font, size)
    c.setFillColor(color)
    for line in wrap(text, font, size, width):
        c.drawString(x, y, line)
        y -= leading
    return y


def section_title(c, title, x, y, width):
    c.setFillColor(PURPLE)
    c.rect(x, y - 3, 4, 14, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 10.5)
    c.drawString(x + 10, y, title.upper())
    c.setStrokeColor(LIGHT)
    c.setLineWidth(0.8)
    c.line(x, y - 7, x + width, y - 7)
    return y - 22


def bullet(c, text, x, y, width):
    c.setFillColor(CYAN)
    c.circle(x + 2.5, y + 2.7, 1.7, fill=1, stroke=0)
    return draw_wrapped(c, text, x + 10, y, width - 10, size=8.2, leading=10.4, color=INK)


def label_value(c, label, value, x, y, width):
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7.2)
    c.drawString(x, y, label.upper())
    return draw_wrapped(c, value, x, y - 11, width, size=8.3, leading=10.5, color=INK) - 7


def build_resume():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=A4)
    c.setTitle("Sonu Kumar - Full-Stack Developer Resume")
    c.setAuthor("Sonu Kumar")
    c.setSubject("Full-Stack Developer Resume")

    c.setFillColor(NAVY)
    c.rect(0, PAGE_H - 132, PAGE_W, 132, fill=1, stroke=0)
    c.setFillColor(PURPLE)
    c.circle(PAGE_W - 55, PAGE_H - 34, 90, fill=1, stroke=0)
    c.setFillColor(CYAN)
    c.circle(PAGE_W - 8, PAGE_H - 118, 43, fill=1, stroke=0)

    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(40, PAGE_H - 52, "SONU KUMAR")
    c.setFillColor(CYAN)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(41, PAGE_H - 73, "FULL-STACK DEVELOPER")
    c.setFillColor(WHITE)
    c.setFont("Helvetica", 8.4)
    c.drawString(41, PAGE_H - 96, "Sahibabad, Uttar Pradesh, India  |  +91-9667474437  |  sonukumar4533n@gmail.com")
    c.drawString(41, PAGE_H - 112, "github.com/sonuk4533N  |  linkedin.com/in/sonukumar45")

    left_x = 40
    left_w = 165
    right_x = 232
    right_w = PAGE_W - right_x - 40
    top_y = PAGE_H - 160

    c.setFillColor(HexColor("#F6F7FB"))
    c.roundRect(left_x - 12, 38, left_w + 24, top_y - 22, 10, fill=1, stroke=0)

    y = section_title(c, "Core Skills", left_x, top_y, left_w)
    skill_groups = [
        ("Front-End", "HTML5, CSS3, JavaScript, React.js, Angular, Bootstrap, Tailwind CSS"),
        ("Back-End", "Node.js, Express.js, PHP, REST APIs, JWT authentication"),
        ("Data", "MySQL, SQLite, database design, query optimization"),
        ("Tools", "Git, GitHub, Postman, VS Code, Chrome DevTools, npm")
    ]
    for label, value in skill_groups:
        y = label_value(c, label, value, left_x, y, left_w)

    y = section_title(c, "Education", left_x, y - 2, left_w)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(left_x, y, "Bachelor of Computer Application")
    y -= 11
    y = draw_wrapped(c, "Modern College of Professional Studies, Ghaziabad", left_x, y, left_w, size=8, leading=10, color=MUTED)
    y = draw_wrapped(c, "Currently pursuing", left_x, y - 2, left_w, font="Helvetica-Oblique", size=7.8, leading=10, color=PURPLE) - 9

    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(left_x, y, "Full-Stack Web Development")
    y -= 11
    y = draw_wrapped(c, "Arth Institute, Laxmi Nagar - 120-hour practical training", left_x, y, left_w, size=8, leading=10, color=MUTED)
    y = draw_wrapped(c, "Completed 2024", left_x, y - 2, left_w, font="Helvetica-Oblique", size=7.8, leading=10, color=PURPLE) - 9

    y = section_title(c, "Highlights", left_x, y - 2, left_w)
    for item in ["5+ portfolio and client projects", "3+ client engagements", "94/100 Lighthouse score on a delivered site"]:
        y = bullet(c, item, left_x, y, left_w) - 5

    y = section_title(c, "Profile", right_x, top_y, right_w)
    y = draw_wrapped(
        c,
        "Full-stack developer building responsive, scalable web applications with React, Angular, Node.js, PHP, and relational databases. Focused on clean, maintainable code, reliable APIs, accessible interfaces, and performance-conscious delivery.",
        right_x,
        y,
        right_w,
        size=8.6,
        leading=11.5,
        color=INK,
    ) - 9

    y = section_title(c, "Experience", right_x, y, right_w)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(right_x, y, "Freelance Web Developer")
    c.setFillColor(PURPLE)
    c.setFont("Helvetica-Bold", 8)
    c.drawRightString(right_x + right_w, y, "2024 - Present")
    y -= 13
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Oblique", 8.3)
    c.drawString(right_x, y, "Self-Employed")
    y -= 15
    experience_bullets = [
        "Develop and deploy responsive websites across e-commerce, service, and portfolio use cases.",
        "Manage the full delivery lifecycle from requirements and implementation through deployment and maintenance.",
        "Build reusable interfaces and REST APIs with validation, authentication, database integration, and error handling."
    ]
    for item in experience_bullets:
        y = bullet(c, item, right_x, y, right_w) - 4

    y = section_title(c, "Selected Projects", right_x, y - 3, right_w)
    projects = [
        ("SarvadaaPower Corporate Website", "Responsive energy-sector website used as a primary online presence and lead-generation channel. Optimized for mobile, SEO, and page performance."),
        ("E-Commerce Product Platform", "React and Node.js platform with product search, filtering, cart state, REST endpoints, MySQL persistence, and JWT-based authentication."),
        ("Portfolio Content Platform", "Responsive portfolio with an Express and SQLite API, secure administration, editable content, contact messages, and production-safe validation.")
    ]
    for title, description in projects:
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 8.8)
        c.drawString(right_x, y, title)
        y -= 11
        y = draw_wrapped(c, description, right_x, y, right_w, size=8, leading=10.2, color=MUTED) - 7

    y = section_title(c, "Working Style", right_x, y - 1, right_w)
    for item in [
        "Responsive-first UI development and accessibility-minded markup",
        "Version-controlled delivery with testing, debugging, and documented handoff",
        "Clear communication from requirements through post-launch support"
    ]:
        y = bullet(c, item, right_x, y, right_w) - 4

    c.setStrokeColor(LIGHT)
    c.line(40, 27, PAGE_W - 40, 27)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7.2)
    c.drawString(40, 15, "Portfolio: github.com/sonuk4533N")
    c.drawRightString(PAGE_W - 40, 15, "References and project details available on request")

    c.save()
    print(OUTPUT)


if __name__ == "__main__":
    build_resume()
