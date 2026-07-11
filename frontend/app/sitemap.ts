import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/api";

const BASE_URL = "https://karanpateldev.indevs.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/experience", "/projects", "/work-with-me", "/contact", "/resume"].map((path) => ({
    url: `${BASE_URL}${path}`,
  }));

  const projects = await getProjects().catch(() => []);
  const projectRoutes = projects.map((p) => ({ url: `${BASE_URL}/projects/${p.slug}` }));

  return [...staticRoutes, ...projectRoutes];
}
