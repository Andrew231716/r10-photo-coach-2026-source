import type { MetadataRoute } from "next";
import { academyLevels } from "@/data/academy";
import { tutorials } from "@/data/tutorials";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://r10-photo-coach-2026.vercel.app";
  const now = new Date();

  const staticRoutes = ["", "/academy/", "/tutorials/", "/coach/", "/simulator/", "/lenses/", "/gear/", "/profile/"].map(
    (path) => ({
      url: `${site}${path || "/"}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  const tutorialRoutes = tutorials.map((tutorial) => ({
    url: `${site}/tutorials/${tutorial.slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: tutorial.featured ? 0.75 : 0.6,
  }));

  const academyRoutes = academyLevels.flatMap((level) =>
    level.modules.map((module) => ({
      url: `${site}/academy/${module.id}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  );

  return [...staticRoutes, ...tutorialRoutes, ...academyRoutes];
}
