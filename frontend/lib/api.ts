import type {
  Availability,
  ContactRequest,
  Experience,
  Project,
  Resume,
  Service,
  SiteContent,
  Testimonial,
} from "./types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8123";

// Every call uses cache: "no-store" so admin-panel edits are reflected on the
// next page load immediately — no ISR/webhook plumbing needed for a
// low-traffic portfolio site.
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${path} failed: ${res.status} ${body}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ---- Public reads ----
export const getProjects = () => apiFetch<Project[]>("/api/projects");
export const getProject = (slug: string) => apiFetch<Project>(`/api/projects/${slug}`);
export const getExperience = () => apiFetch<Experience[]>("/api/experience");
export const getTestimonials = () => apiFetch<Testimonial[]>("/api/testimonials");
export const getServices = () => apiFetch<Service[]>("/api/services");
export const getContentBlocks = () => apiFetch<SiteContent[]>("/api/content");
export const getContentBlock = (key: string) => apiFetch<SiteContent>(`/api/content/${key}`);
export const getAvailability = () => apiFetch<Availability>("/api/availability");
export const getResume = () => apiFetch<Resume>("/api/resume");

// ---- Public writes ----
export const submitContact = (body: {
  name: string;
  email: string;
  message: string;
  budget_range?: string;
  timeline?: string;
  website?: string;
}) => apiFetch<ContactRequest>("/api/contact", { method: "POST", body: JSON.stringify(body) });

export const trackResumeDownload = () => apiFetch<Resume>("/api/resume/track", { method: "POST" });

// ---- Admin ----
export const adminLogin = (username: string, password: string) =>
  apiFetch<{ ok: true }>("/api/admin/login", { method: "POST", body: JSON.stringify({ username, password }) });

export const adminLogout = () => apiFetch<{ ok: true }>("/api/admin/logout", { method: "POST" });

export const adminMe = () => apiFetch<{ ok: true }>("/api/admin/me");

export const adminListAllServices = () => apiFetch<Service[]>("/api/services/all");
export const adminListAllTestimonials = () => apiFetch<Testimonial[]>("/api/testimonials/all");
export const adminListContactRequests = () => apiFetch<ContactRequest[]>("/api/admin/contact-requests");

export function adminSave<T>(path: string, method: "POST" | "PUT", body: unknown): Promise<T> {
  return apiFetch<T>(path, { method, body: JSON.stringify(body) });
}

export function adminDelete(path: string): Promise<void> {
  return apiFetch<void>(path, { method: "DELETE" });
}

export async function adminUploadMedia(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_URL}/api/admin/media/upload`, {
    method: "POST",
    credentials: "include",
    body: form,
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

export async function adminUploadResume(file: File): Promise<Resume> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_URL}/api/resume/upload`, {
    method: "PUT",
    credentials: "include",
    body: form,
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}
