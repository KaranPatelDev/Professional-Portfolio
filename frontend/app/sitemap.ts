import type { MetadataRoute } from "next";
import { getBuildLogPosts, getProjects } from "@/lib/api";

const BASE_URL = "https://karanpateldev.indevs.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/experience", "/projects", "/build-log", "/work-with-me", "/contact", "/resume"].map(
    (path) => ({ url: `${BASE_URL}${path}` })
  );

  const [projects, posts] = await Promise.all([getProjects().catch(() => []), getBuildLogPosts().catch(() => [])]);
  const projectRoutes = projects.map((p) => ({ url: `${BASE_URL}/projects/${p.slug}` }));
  const buildLogRoutes = posts.map((p) => ({ url: `${BASE_URL}/build-log/${p.slug}` }));

  return [...staticRoutes, ...projectRoutes, ...buildLogRoutes];
}
