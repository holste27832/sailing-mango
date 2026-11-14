import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import matter from "gray-matter";
import markdownIt from "markdown-it";
import { HtmlBasePlugin } from "@11ty/eleventy";

// Alt indhold, som kan redigeres, ligger i mappen "indhold".
// Skabeloner, design og kode ligger i "src" og skal sjældent røres.
const INDHOLD = "indhold";

const md = markdownIt({ html: true, breaks: true, linkify: true });

function readYaml(file) {
  const p = path.join(INDHOLD, file);
  return fs.existsSync(p) ? yaml.load(fs.readFileSync(p, "utf8")) || {} : {};
}

function readTogter() {
  const dir = path.join(INDHOLD, "togter");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
      return { ...data, slug: f.replace(/\.md$/, ""), body: content };
    })
    .filter((t) => t.vis !== false)
    .sort((a, b) => new Date(a.start || 0) - new Date(b.start || 0));
}

function toDate(v) {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  return isNaN(d) ? null : d;
}

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // Indhold -> globale data
  eleventyConfig.addGlobalData("site", () => readYaml("indstillinger.yml"));
  eleventyConfig.addGlobalData("forside", () => readYaml("forside.yml"));
  eleventyConfig.addGlobalData("baaden", () => readYaml("baaden.yml"));
  eleventyConfig.addGlobalData("omos", () => readYaml("om-os.yml"));
  eleventyConfig.addGlobalData("blivgast", () => readYaml("bliv-gast.yml"));
  eleventyConfig.addGlobalData("togter", readTogter);
  eleventyConfig.addWatchTarget(`./${INDHOLD}/`);

  // Billeder/video uploadet via redigeringsværktøjet
  eleventyConfig.addPassthroughCopy({ [`${INDHOLD}/billeder`]: "billeder" });
  eleventyConfig.addPassthroughCopy({ "src/css": "css", "src/js": "js", "src/admin": "admin" });

  // Filtre
  eleventyConfig.addFilter("md", (s) => (s ? md.render(String(s)) : ""));
  eleventyConfig.addFilter("mdInline", (s) => (s ? md.renderInline(String(s)) : ""));
  eleventyConfig.addFilter("dato", (v, opts = "lang") => {
    const d = toDate(v);
    if (!d) return "";
    const o =
      opts === "kort"
        ? { day: "numeric", month: "short" }
        : { day: "numeric", month: "long", year: "numeric" };
    return new Intl.DateTimeFormat("da-DK", { ...o, timeZone: "UTC" }).format(d);
  });
  eleventyConfig.addFilter("dage", (a, b) => {
    const s = toDate(a), e = toDate(b);
    if (!s || !e) return "";
    return Math.round((e - s) / 86400000) + 1;
  });
  eleventyConfig.addFilter("isVideo", (s) => /\.(mp4|webm|mov)$/i.test(s || ""));
  eleventyConfig.addFilter("statusKlasse", (s) => {
    const v = (s || "").toLowerCase();
    if (v.includes("fuld")) return "fuld";
    if (v.includes("få") || v.includes("fa ")) return "faa";
    if (v.includes("snart") || v.includes("planl")) return "snart";
    return "ledig";
  });
  eleventyConfig.addFilter("slugify2", (s) =>
    String(s || "")
      .toLowerCase()
      .replace(/æ/g, "ae").replace(/ø/g, "oe").replace(/å/g, "aa")
      .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  );

  eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));

  return {
    dir: { input: "src", output: "_site", includes: "_includes" },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
  };
}
