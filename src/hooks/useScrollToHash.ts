import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scrolls to #section links, e.g. /#collections */
export const useScrollToHash = () => {
  const { hash } = useLocation();

  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!id) return;
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => clearTimeout(timer);
  }, [hash]);
};
