import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "City Properties", short_name: "City Properties", start_url: "/", display: "standalone", background_color: "#F4F5F7", theme_color: "#12263F", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }] };
}
