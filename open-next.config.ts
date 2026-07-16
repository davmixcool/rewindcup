import { defineCloudflareConfig } from "@opennextjs/cloudflare";
// import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  // Enable R2 caching here if the app adopts ISR or Next.js data caching.
  // See https://opennext.js.org/cloudflare/caching for configuration details.
  // incrementalCache: r2IncrementalCache
});
