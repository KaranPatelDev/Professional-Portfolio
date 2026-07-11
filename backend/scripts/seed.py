"""Seed the DB with the real, confirmed content from the strategy doc.
Safe to re-run: uses upsert-by-key logic, won't duplicate rows.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import select

from app.database import Base, SessionLocal, engine
from app.models import Experience, Project, Service, SiteContent

Base.metadata.create_all(bind=engine)

db = SessionLocal()

SITE_CONTENT = [
    dict(
        key="hero_headline",
        label="Hero headline",
        value_html="<p>I build backend systems that businesses actually run on.</p>",
        page="homepage",
    ),
    dict(
        key="hero_supporting",
        label="Hero supporting copy",
        value_html="<p>Backend-focused full-stack engineer specializing in Python and FastAPI. Currently open to backend/full-stack roles and select freelance projects.</p>",
        page="homepage",
    ),
    dict(
        key="bio_short",
        label="Short bio (~40 words)",
        value_html="<p>Karan Patel is a backend-focused full-stack engineer specializing in Python and FastAPI. He builds production APIs as an AI + Backend Developer at BonsAI Agents and delivered D&amp;D Purchase, a live B2B buyer-seller platform, as an independent freelance developer.</p>",
        page="about",
    ),
    dict(
        key="bio_long",
        label="Long bio (~120 words, About page)",
        value_html="<p>I'm a backend engineer who cares more about whether a system actually works in production than how it looks in a slide deck. As an AI + Backend Developer at BonsAI Agents, I built and shipped 10+ FastAPI endpoints, cut average database response time by roughly 30% through indexing and query restructuring, and resolved 15+ production issues. Outside that, I've worked as a freelance full-stack developer &mdash; my strongest project, D&amp;D Purchase, is a live B2B platform with separate buyer and seller workflows that I took from requirements to deployment for a paying client. I also build applied-AI tools on the side (RAG pipelines, document processing, AI agents) because I like understanding how new tools actually get used, not just how they demo.</p>",
        page="about",
    ),
    dict(
        key="freelance_pitch",
        label="Freelance pitch",
        value_html="<p>I take a business problem &mdash; an internal tool, an MVP, a broken API &mdash; and own it end-to-end: requirements, architecture, build, deployment, and handover.</p>",
        page="work-with-me",
    ),
    dict(
        key="core_stack",
        label="Core stack (homepage)",
        value_html="<p>Python (Full-Stack), FastAPI, MySQL, PostgreSQL, MongoDB, Docker, Git, Postman</p>",
        page="homepage",
    ),
]

EXPERIENCE = dict(
    company="BonsAI Agents",
    role="AI + Backend Developer",
    start_date="Dec 2025",
    end_date=None,
    summary="Built and maintained Python backend systems, shipping 10+ FastAPI endpoints with strict Pydantic schema validation. Improved average database response time by ~30% through indexing and query restructuring across MySQL and MongoDB. Resolved 15+ production issues and worked directly in Docker-based deployment environments.",
    metrics=["10+ endpoints shipped", "~30% DB response time improvement", "15+ production issues resolved"],
    tools=["Python", "FastAPI", "MySQL", "PostgreSQL", "MongoDB", "Docker", "Git", "Postman"],
    body_html=None,
    display_order=0,
)

DND_PURCHASE = dict(
    slug="dnd-purchase",
    title="D&D Purchase — B2B Buyer-Seller Platform",
    category="Client Work",
    tags="client_work",
    status="live",
    summary="A live commercial platform connecting business buyers and sellers through structured inquiry and bidding workflows.",
    role="Freelance full-stack developer — handled requirements, planning, implementation, testing, deployment, revisions, and client communication.",
    stack=["React", "TypeScript", "Node.js", "Express", "MongoDB", "Firebase Auth"],
    thumbnail_url=None,
    gallery_urls=[],
    live_url=None,
    github_url=None,
    featured=True,
    display_order=0,
    body_html=(
        "<p>D&amp;D Purchase is a live B2B platform connecting business buyers and sellers "
        "through structured inquiry and bidding workflows, replacing informal email/phone-based deal flow.</p>"
        "<h3>Architecture</h3>"
        "<p>React + TypeScript frontend; Node.js + Express + TypeScript backend; MongoDB database; "
        "Firebase Authentication (including Google account linking and secondary email support); Firebase hosting/deployment.</p>"
        "<h3>Key features</h3>"
        "<ul><li>Buyer inquiries and seller bidding, with active/closed bidding states</li>"
        "<li>Product management</li><li>Buyer/seller profiles and account settings</li>"
        "<li>Google account connection and secondary email support</li>"
        "<li>Buyer identification codes and role-based functionality</li></ul>"
        "<h3>Technical challenges</h3>"
        "<p>Role-based access control across two distinct user types; managing inquiry/bid state transitions; "
        "secondary email + Google account linking on one identity.</p>"
        "<p><em>This project was built under an NDA. Only the general purpose, my role, high-level architecture, "
        "and technologies used are shown here &mdash; no client-confidential information, source code, or "
        "unsanitized data.</em></p>"
    ),
    metrics={},
)

SERVICES = [
    dict(
        name="Backend & API development",
        client_problem="Our backend is fragile / we need one built",
        deliverable="FastAPI/Django backend, validated APIs",
        stack=["FastAPI", "Pydantic", "PostgreSQL"],
        proof="Magenta Connects, D&D Purchase",
        public=True,
        display_order=0,
    ),
    dict(
        name="SaaS MVP development",
        client_problem="I have an idea, need it built",
        deliverable="Full-stack MVP, deployed",
        stack=["Next.js", "FastAPI", "PostgreSQL"],
        proof="D&D Purchase",
        public=True,
        display_order=1,
    ),
    dict(
        name="Fullstack mobile & web applications",
        client_problem="I need a mobile or web app built end-to-end",
        deliverable="Cross-platform mobile app or responsive web app, deployed",
        stack=["React Native", "Next.js", "React", "FastAPI"],
        proof="D&D Purchase, NGO Health App",
        public=True,
        display_order=2,
    ),
    dict(
        name="Custom business applications",
        client_problem="We manage things in spreadsheets/email",
        deliverable="Structured internal tool",
        stack=["Full stack"],
        proof="D&D Purchase",
        public=True,
        display_order=3,
    ),
    dict(
        name="AI product integration",
        client_problem="We want AI in our product",
        deliverable="RAG/LLM integration",
        stack=["Gemini API", "vector DBs", "embeddings"],
        proof="AI Product Manager, Dev Interviewer",
        public=True,
        display_order=4,
    ),
    dict(
        name="Workflow automation",
        client_problem="This manual process wastes time",
        deliverable="Background jobs, automation",
        stack=["Celery", "Redis", "RabbitMQ"],
        proof="Internship experience",
        public=True,
        display_order=5,
    ),
    dict(
        name="Database optimization",
        client_problem="Our queries are slow",
        deliverable="Indexing, query restructuring",
        stack=["PostgreSQL", "MySQL", "MongoDB"],
        proof="~30% improvement metric",
        public=True,
        display_order=6,
    ),
]


def upsert_content():
    for row in SITE_CONTENT:
        existing = db.scalar(select(SiteContent).where(SiteContent.key == row["key"]))
        if existing:
            continue
        db.add(SiteContent(**row))


def upsert_experience():
    existing = db.scalar(select(Experience).where(Experience.company == EXPERIENCE["company"]))
    if not existing:
        db.add(Experience(**EXPERIENCE))


def upsert_project():
    existing = db.scalar(select(Project).where(Project.slug == DND_PURCHASE["slug"]))
    if not existing:
        db.add(Project(**DND_PURCHASE))


def upsert_services():
    for row in SERVICES:
        existing = db.scalar(select(Service).where(Service.name == row["name"]))
        if not existing:
            db.add(Service(**row))


upsert_content()
upsert_experience()
upsert_project()
upsert_services()
db.commit()
print("Seed complete.")
