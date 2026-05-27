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
  ];
}
