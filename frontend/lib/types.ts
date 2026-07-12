export type Project = {
  id: number;
  slug: string;
  title: string;
  category: string;
  tags: "client_work" | "personal" | "ai_experiment";
  status: "live" | "in_development" | "concept";
  summary: string;
  role: string | null;
  stack: string[];
  thumbnail_url: string | null;
  gallery_urls: string[];
  live_url: string | null;
  github_url: string | null;
  featured: boolean;
  display_order: number;
  body_html: string | null;
  metrics: Record<string, string | number>;
  freelance_status: "shipped" | "in_progress" | "potential_customer" | null;
  hidden: boolean;
  created_at: string;
  updated_at: string;
};

export type Experience = {
  id: number;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  summary: string;
  metrics: string[];
  tools: string[];
  body_html: string | null;
  display_order: number;
};

export type Testimonial = {
  id: number;
  project_id: number | null;
  quote: string;
  author: string;
  permission_granted: boolean;
};

export type Service = {
  id: number;
  name: string;
  client_problem: string;
  deliverable: string;
  stack: string[];
  proof: string | null;
  public: boolean;
  display_order: number;
};

export type SiteContent = {
  id: number;
  key: string;
  label: string;
  value_html: string;
  page: string;
};

export type Availability = {
  status_text: string;
  updated_at: string;
};

export type Resume = {
  file_url: string | null;
  download_count: number;
  updated_at: string;
};

export type ResumeDownloadEvent = {
  id: number;
  referrer: string | null;
  user_agent: string | null;
  created_at: string;
};

export type BuildLogPost = {
  id: number;
  slug: string;
  title: string;
  summary: string | null;
  body_html: string;
  published: boolean;
  published_at: string;
  github_repo: string | null;
};

export type GitCommit = {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
};

export type Whoami = {
  name: string;
  role: string | null;
  company: string | null;
  availability_status: string;
  core_stack: string[];
  tenure: string | null;
  project_count: number;
  client_project_count: number;
  live_project_count: number;
};

export type BackendStatus = {
  status: string;
  started_at: string;
  uptime_seconds: number;
};

export type ContactRequest = {
  id: number;
  name: string;
  email: string;
  message: string;
  budget_range: string | null;
  timeline: string | null;
  created_at: string;
  email_sent: boolean;
};
