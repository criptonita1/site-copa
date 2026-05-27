import type { MetadataRoute } from "next";
import { APP } from "@/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${APP.SITE_URL}/sitemap.xml`,
  };
}
