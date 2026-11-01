import { useEffect } from "react";
import { SITE } from "@/lib/site";

type Props = {
  title?: string;
  description?: string;
  image?: string;
  jsonLd?: Record<string, unknown>;
  noindex?: boolean;
};

const setMeta = (attr: "name" | "property", key: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
};

/** Sets the page title, description, social-share tags and optional JSON-LD. */
const Seo = ({ title, description, image, jsonLd, noindex }: Props) => {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${SITE.name}`
      : `${SITE.name} | Handmade Crochet from Jhansi`;
    const desc =
      description ??
      "Handcrafted crochet bouquets, cuddle toys, accessories and more — made stitch by stitch in Jhansi. Custom orders welcome.";
    document.title = fullTitle;
    setMeta("name", "description", desc);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", desc);
    const url = `${SITE.url}${window.location.pathname}`;
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", "website");
    if (image) {
      setMeta("property", "og:image", image.startsWith("http") ? image : `${SITE.url}${image}`);
    }
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
    return () => {
      script?.remove();
    };
  }, [title, description, image, noindex, JSON.stringify(jsonLd)]);

  return null;
};

export default Seo;
