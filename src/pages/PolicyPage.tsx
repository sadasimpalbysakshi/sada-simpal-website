import { Link } from "react-router-dom";
import { POLICIES } from "@/content/policies";
import Seo from "@/components/Seo";
import NotFound from "./NotFound";

const PolicyPage = ({ slug }: { slug: keyof typeof POLICIES }) => {
  const policy = POLICIES[slug];
  if (!policy) return <NotFound />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <Seo title={policy.title} description={policy.intro} />
      <h1 className="font-display text-4xl md:text-5xl mb-3">{policy.title}</h1>
      <p className="text-muted-foreground">{policy.intro}</p>
      <p className="mt-1 text-xs text-muted-foreground">Last updated: {policy.updated}</p>

      <div className="mt-10 space-y-8">
        {policy.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-display text-2xl mb-3">{s.heading}</h2>
            {s.body.map((p) => (
              <p key={p} className="mb-3 leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
            {s.list && (
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                {s.list.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <p className="mt-12 text-sm text-muted-foreground">
        Still have questions?{" "}
        <Link to="/contact" className="underline">
          Get in touch
        </Link>
        .
      </p>
    </div>
  );
};

export default PolicyPage;
