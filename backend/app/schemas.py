from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class ProjectBase(BaseModel):
    slug: str
    title: str
    category: str
    tags: str = "personal"
    status: str = "live"
    summary: str
    role: str | None = None
    stack: list[str] = []
    thumbnail_url: str | None = None
    gallery_urls: list[str] = []
    live_url: str | None = None
    github_url: str | None = None
    featured: bool = False
    display_order: int = 0
    body_html: str | None = None
    metrics: dict = {}
    freelance_status: str | None = None  # shipped | in_progress | potential_customer
    hidden: bool = False


class ProjectCreate(ProjectBase):
    pass


class ProjectOut(ProjectBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    updated_at: datetime


class ExperienceBase(BaseModel):
    company: str
    role: str
    start_date: str
    end_date: str | None = None
    summary: str
    metrics: list[str] = []
    tools: list[str] = []
    body_html: str | None = None
    display_order: int = 0


class ExperienceOut(ExperienceBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class TestimonialBase(BaseModel):
    project_id: int | None = None
    quote: str
    author: str
    permission_granted: bool = False


class TestimonialOut(TestimonialBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class ServiceBase(BaseModel):
    name: str
    client_problem: str
    deliverable: str
    stack: list[str] = []
    proof: str | None = None
    public: bool = True
    display_order: int = 0


class ServiceOut(ServiceBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class SiteContentBase(BaseModel):
    key: str
    label: str
    value_html: str = ""
    page: str = "homepage"


class SiteContentOut(SiteContentBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class BuildLogPostBase(BaseModel):
    slug: str
    title: str
    summary: str | None = None
    body_html: str = ""
    published: bool = True
    github_repo: str | None = None


class BuildLogPostOut(BuildLogPostBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    published_at: datetime


class GitCommitOut(BaseModel):
    sha: str
    message: str
    author: str
    date: datetime
    url: str


class AvailabilityOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    status_text: str
    updated_at: datetime


class AvailabilityUpdate(BaseModel):
    status_text: str


class ResumeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    file_url: str | None
    download_count: int
    updated_at: datetime


class ResumeDownloadTrack(BaseModel):
    referrer: str | None = None


class ResumeDownloadEventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    referrer: str | None
    user_agent: str | None
    created_at: datetime


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    message: str
    budget_range: str | None = None
    timeline: str | None = None
    # honeypot field: real users leave it blank, bots tend to fill every field
    website: str = ""


class ContactOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: str
    message: str
    budget_range: str | None
    timeline: str | None
    created_at: datetime
    email_sent: bool


class LoginRequest(BaseModel):
    username: str
    password: str


class WhoamiOut(BaseModel):
    name: str
    role: str | None
    company: str | None
    availability_status: str
    core_stack: list[str]
    tenure: str | None
    project_count: int
    client_project_count: int
    live_project_count: int


class StatusOut(BaseModel):
    status: str
    started_at: datetime
    uptime_seconds: int
