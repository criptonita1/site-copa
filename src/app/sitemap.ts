import type { MetadataRoute } from "next";
import { APP } from "@/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: APP.SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${APP.SITE_URL}/chaveamento`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${APP.SITE_URL}/privacidade`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
