/**
 * services/api.js
 * Google PageSpeed Insights API (v5) — Free tier: 25,000 req/day
 * Docs: https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed
 *
 * Fallback: If the API quota is exceeded or unavailable,
 * realistic mock data is returned so the app always works for demos.
 */

const BASE_URL = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const API_KEY = process.env.REACT_APP_PAGESPEED_API_KEY || "";

/**
 * Fetch PageSpeed analysis for a URL
 * Falls back to realistic mock data on quota/network errors.
 * @param {string} url - Website URL to analyze
 * @param {string} strategy - "mobile" | "desktop"
 * @returns {Promise<Object>} Parsed analysis result
 */
export const analyzeWebsite = async (url, strategy = "desktop") => {
  const categories = ["performance", "seo", "accessibility", "best-practices"];
  const params = new URLSearchParams({
    url,
    strategy,
    ...(API_KEY && { key: API_KEY }),
  });
  categories.forEach((cat) => params.append("category", cat));

  const endpoint = `${BASE_URL}?${params.toString()}`;

  try {
    const res = await fetch(endpoint);
    const data = await res.json();

    // Quota exceeded (429) or any API error — fall back to mock
    if (!res.ok) {
      const errMsg = data?.error?.message || "";
      const isQuota = res.status === 429 || errMsg.toLowerCase().includes("quota");
      const isInvalid = res.status === 400;

      if (isInvalid) {
        throw new Error("Invalid URL or the website could not be reached.");
      }

      if (isQuota) {
        console.warn("⚠️  PageSpeed API quota exceeded — using demo data.");
        return generateMockResult(url, strategy);
      }

      if (res.status === 403) {
        throw new Error("API key error. Check your REACT_APP_PAGESPEED_API_KEY in .env");
      }

      // Any other error → mock
      console.warn(`⚠️  API error ${res.status} — using demo data.`);
      return generateMockResult(url, strategy);
    }

    return parseApiResponse(data, url, strategy);

  } catch (err) {
    // Network offline or fetch itself failed
    if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
      console.warn("⚠️  Network unavailable — using demo data.");
      return generateMockResult(url, strategy);
    }
    // Re-throw validation errors (bad URL etc.)
    throw err;
  }
};

/**
 * Parse raw PageSpeed API response into a clean object
 */
const parseApiResponse = (data, url, strategy) => {
  const lhr = data.lighthouseResult;
  const cats = lhr.categories;
  const audits = lhr.audits;

  // --- Scores (0–100) ---
  const scores = {
    performance: Math.round((cats.performance?.score ?? 0) * 100),
    seo: Math.round((cats.seo?.score ?? 0) * 100),
    accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round((cats["best-practices"]?.score ?? 0) * 100),
  };

  // --- Core Web Vitals ---
  const vitals = {
    fcp: {
      label: "First Contentful Paint",
      value: audits["first-contentful-paint"]?.displayValue ?? "N/A",
      score: Math.round((audits["first-contentful-paint"]?.score ?? 0) * 100),
      numericValue: audits["first-contentful-paint"]?.numericValue ?? 0,
    },
    lcp: {
      label: "Largest Contentful Paint",
      value: audits["largest-contentful-paint"]?.displayValue ?? "N/A",
      score: Math.round((audits["largest-contentful-paint"]?.score ?? 0) * 100),
      numericValue: audits["largest-contentful-paint"]?.numericValue ?? 0,
    },
    tbt: {
      label: "Total Blocking Time",
      value: audits["total-blocking-time"]?.displayValue ?? "N/A",
      score: Math.round((audits["total-blocking-time"]?.score ?? 0) * 100),
      numericValue: audits["total-blocking-time"]?.numericValue ?? 0,
    },
    cls: {
      label: "Cumulative Layout Shift",
      value: audits["cumulative-layout-shift"]?.displayValue ?? "N/A",
      score: Math.round((audits["cumulative-layout-shift"]?.score ?? 0) * 100),
      numericValue: audits["cumulative-layout-shift"]?.numericValue ?? 0,
    },
    si: {
      label: "Speed Index",
      value: audits["speed-index"]?.displayValue ?? "N/A",
      score: Math.round((audits["speed-index"]?.score ?? 0) * 100),
      numericValue: audits["speed-index"]?.numericValue ?? 0,
    },
    tti: {
      label: "Time to Interactive",
      value: audits["interactive"]?.displayValue ?? "N/A",
      score: Math.round((audits["interactive"]?.score ?? 0) * 100),
      numericValue: audits["interactive"]?.numericValue ?? 0,
    },
  };

  // --- SEO + Accessibility Issues (failed audits only) ---
  const TRACKED_AUDITS = [
    { id: "meta-description", category: "SEO", severity: "Medium" },
    { id: "document-title", category: "SEO", severity: "High" },
    { id: "image-alt", category: "Accessibility", severity: "High" },
    { id: "link-text", category: "SEO", severity: "Medium" },
    { id: "crawlable-anchors", category: "SEO", severity: "Medium" },
    { id: "is-crawlable", category: "SEO", severity: "High" },
    { id: "hreflang", category: "SEO", severity: "Low" },
    { id: "canonical", category: "SEO", severity: "Medium" },
    { id: "viewport", category: "Accessibility", severity: "High" },
    { id: "color-contrast", category: "Accessibility", severity: "High" },
    { id: "heading-order", category: "Accessibility", severity: "Medium" },
    { id: "label", category: "Accessibility", severity: "High" },
    { id: "uses-optimized-images", category: "Performance", severity: "Medium" },
    { id: "uses-responsive-images", category: "Performance", severity: "Medium" },
    { id: "render-blocking-resources", category: "Performance", severity: "High" },
    { id: "unused-css-rules", category: "Performance", severity: "Low" },
    { id: "unused-javascript", category: "Performance", severity: "Medium" },
    { id: "uses-text-compression", category: "Performance", severity: "Medium" },
    { id: "uses-https", category: "Best Practices", severity: "High" },
    { id: "no-vulnerable-libraries", category: "Best Practices", severity: "High" },
    { id: "csp-xss", category: "Best Practices", severity: "Medium" },
  ];

  const issues = TRACKED_AUDITS.reduce((acc, { id, category, severity }) => {
    const audit = audits[id];
    if (!audit) return acc;
    // score === 0 means fail; null means not applicable
    if (audit.score !== null && audit.score < 1) {
      acc.push({
        id,
        title: audit.title,
        description: audit.description,
        category,
        severity,
        score: Math.round((audit.score ?? 0) * 100),
        displayMode: audit.scoreDisplayMode,
      });
    }
    return acc;
  }, []);

  // Sort: High → Medium → Low
  const severityOrder = { High: 0, Medium: 1, Low: 2 };
  issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return {
    url,
    strategy,
    analyzedAt: new Date().toISOString(),
    scores,
    vitals,
    issues,
    totalResources: audits["network-requests"]?.details?.items?.length ?? null,
    pageSize: audits["total-byte-weight"]?.displayValue ?? null,
  };
};

/* ─────────────────────────────────────────────────────────────
   MOCK DATA GENERATOR
   Produces realistic, URL-seeded scores so each domain returns
   consistent (but varied) demo data.  Used when the API quota
   is exceeded or the network is unavailable.
───────────────────────────────────────────────────────────── */

const generateMockResult = (url, strategy) => {
  // Seed a deterministic "random" from the URL so the same site
  // always returns the same mock scores across refreshes.
  const seed = url.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rand = (min, max, offset = 0) => {
    const x = Math.sin(seed + offset) * 10000;
    return Math.round(min + ((x - Math.floor(x)) * (max - min)));
  };

  const perf  = rand(52, 97, 1);
  const seo   = rand(68, 99, 2);
  const a11y  = rand(58, 96, 3);
  const bp    = rand(70, 100, 4);

  const scores = {
    performance:   perf,
    seo:           seo,
    accessibility: a11y,
    bestPractices: bp,
  };

  const vitals = {
    fcp: {
      label: "First Contentful Paint",
      value: `${(rand(8, 28, 10) / 10).toFixed(1)} s`,
      score: rand(45, 95, 10),
      numericValue: rand(800, 2800, 10),
    },
    lcp: {
      label: "Largest Contentful Paint",
      value: `${(rand(12, 50, 11) / 10).toFixed(1)} s`,
      score: rand(40, 92, 11),
      numericValue: rand(1200, 5000, 11),
    },
    tbt: {
      label: "Total Blocking Time",
      value: `${rand(40, 600, 12)} ms`,
      score: rand(35, 95, 12),
      numericValue: rand(40, 600, 12),
    },
    cls: {
      label: "Cumulative Layout Shift",
      value: `${(rand(0, 25, 13) / 100).toFixed(2)}`,
      score: rand(50, 100, 13),
      numericValue: rand(0, 25, 13) / 100,
    },
    si: {
      label: "Speed Index",
      value: `${(rand(15, 60, 14) / 10).toFixed(1)} s`,
      score: rand(40, 90, 14),
      numericValue: rand(1500, 6000, 14),
    },
    tti: {
      label: "Time to Interactive",
      value: `${(rand(20, 80, 15) / 10).toFixed(1)} s`,
      score: rand(35, 90, 15),
      numericValue: rand(2000, 8000, 15),
    },
  };

  // Build a realistic issue list — number of issues inversely
  // correlates with the score (lower score = more issues).
  const ALL_POSSIBLE_ISSUES = [
    { id: "render-blocking-resources",  title: "Eliminate render-blocking resources",        category: "Performance",    severity: "High",   description: "Resources are blocking the first paint of your page. Consider delivering critical JS/CSS inline and deferring all non-critical JS/styles." },
    { id: "unused-javascript",          title: "Remove unused JavaScript",                    category: "Performance",    severity: "Medium", description: "Remove unused JavaScript to reduce bytes consumed by network activity. Consider code-splitting with dynamic import()." },
    { id: "unused-css-rules",           title: "Remove unused CSS",                           category: "Performance",    severity: "Low",    description: "Remove dead rules from stylesheets and defer the loading of CSS not used for above-the-fold content." },
    { id: "uses-optimized-images",      title: "Efficiently encode images",                   category: "Performance",    severity: "Medium", description: "Optimized images load faster and consume less cellular data. Consider using WebP or AVIF format." },
    { id: "uses-responsive-images",     title: "Properly size images",                        category: "Performance",    severity: "Medium", description: "Serve images that are appropriately-sized to save cellular data and improve load time." },
    { id: "uses-text-compression",      title: "Enable text compression",                     category: "Performance",    severity: "Medium", description: "Text-based resources should be served with compression (gzip, deflate or brotli) to minimize total network bytes." },
    { id: "meta-description",           title: "Document does not have a meta description",   category: "SEO",            severity: "Medium", description: "Meta descriptions may be included in search results to concisely summarize page content." },
    { id: "link-text",                  title: "Links do not have descriptive text",           category: "SEO",            severity: "Medium", description: "Descriptive link text helps search engines understand your content. Avoid generic text like 'click here'." },
    { id: "crawlable-anchors",          title: "Links are not crawlable",                     category: "SEO",            severity: "Medium", description: "Search engines may use href attributes on anchor elements to crawl websites. Ensure anchor elements have valid href attribute." },
    { id: "image-alt",                  title: "Image elements do not have alt attributes",   category: "Accessibility",  severity: "High",   description: "Informative elements should aim for short, descriptive alternate text. Decorative elements can be ignored with an empty alt attribute." },
    { id: "color-contrast",             title: "Background and foreground colors lack contrast", category: "Accessibility", severity: "High",  description: "Low-contrast text is difficult or impossible for many users to read. WCAG 2 AA requires a contrast ratio of at least 4.5:1 for normal text." },
    { id: "heading-order",             title: "Heading elements are not in sequentially-descending order", category: "Accessibility", severity: "Medium", description: "Properly ordered headings that do not skip levels convey the semantic structure of the page, making it easier to navigate." },
    { id: "label",                      title: "Form elements do not have associated labels", category: "Accessibility",  severity: "High",   description: "Labels ensure that form controls are announced properly by assistive technologies, like screen readers." },
    { id: "csp-xss",                    title: "Ensure CSP is effective against XSS attacks",  category: "Best Practices", severity: "Medium", description: "A strong Content Security Policy (CSP) significantly reduces the risk of cross-site scripting (XSS) attacks." },
    { id: "no-vulnerable-libraries",    title: "Includes front-end JavaScript libraries with known security vulnerabilities", category: "Best Practices", severity: "High", description: "Some third-party scripts may contain known security vulnerabilities that can be exploited by attackers." },
  ];

  // Pick issues based on score: lower score = more issues shown
  const issueCount = Math.round(((100 - perf) / 100) * 8) + 1;
  const shuffled = [...ALL_POSSIBLE_ISSUES].sort(
    (a, b) => Math.sin(seed + a.id.length) - Math.sin(seed + b.id.length)
  );
  const issues = shuffled.slice(0, Math.min(issueCount, shuffled.length));

  const severityOrder = { High: 0, Medium: 1, Low: 2 };
  issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return {
    url,
    strategy,
    analyzedAt: new Date().toISOString(),
    scores,
    vitals,
    issues,
    totalResources: rand(28, 120, 20),
    pageSize: `${rand(4, 28, 21) / 10} MiB`,
    isMockData: true,   // flag so UI can show a demo banner
  };
};
