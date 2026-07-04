import type { Metadata } from "next";
import Link from "next/link";
import AboutPhoto from "../Components/AboutPhoto";
import ConsoleBreadcrumb from "../Components/terminal/ConsoleBreadcrumb";
import "../styles/about.css";
import {
  aboutBio,
  featuredProjects,
  hobbies,
  highlights,
  otherProjects,
  skillGroups,
  type Project,
} from "@lib/about";
import { pageMetadata, personJsonLd } from "@lib/seo";
import JsonLd from "../Components/JsonLd";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Trust Williams — full-stack developer, founder of Ridely and Ownbase, and Edo Tech Wave ambassador based in Nigeria.",
  path: "/about",
});

function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  const card = (
    <article
      className={`log-card bg-[var(--bg-section)] p-5 rounded-xl border ${
        featured
          ? "border-[var(--accent)] shadow-neon"
          : "border-[var(--surface-border)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          {featured && (
            <span className="text-xs font-mono text-(--accent) uppercase tracking-wide">
              ★ flagship project
            </span>
          )}
          <h3 className={`font-mono text-xl ${featured ? "mt-1" : ""}`}>
            {project.name}
          </h3>
          <p className="mt-1 text-sm text-(--text-muted)">
            {project.role}
            {project.period ? ` · ${project.period}` : ""}
          </p>
        </div>
        {project.href && (
          <span className="log-open-hint shrink-0">&gt; open</span>
        )}
      </div>
      <p className="mt-3 text-sm text-(--text-muted) leading-relaxed">
        {project.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span key={tech} className="tag-flag">
            {tech}
          </span>
        ))}
      </div>
    </article>
  );

  if (project.href) {
    return (
      <Link href={project.href} className="block">
        {card}
      </Link>
    );
  }

  return card;
}

export default function About() {
  return (
    <section>
      <JsonLd data={personJsonLd()} />
      <ConsoleBreadcrumb segments={["about"]} />
      <h1 className="text-3xl font-mono">About</h1>

      <div className="mt-6 grid lg:grid-cols-[minmax(0,17.5rem)_1fr] gap-8 items-start">
        <AboutPhoto src="/profile.jpeg" alt="Trust Williams" />

        <div className="grid md:grid-cols-2 gap-6 min-w-0">
          <div className="terminal terminal-panel md:col-span-2 lg:col-span-1">
            <p className="text-lg leading-relaxed">{aboutBio.summary}</p>
            <p className="mt-4 terminal-muted leading-relaxed">
              As the founder of{" "}
              <span className="text-(--accent)">Ridely</span> and{" "}
              <span className="text-(--accent)">Ownbase</span>, I&apos;ve gone
              beyond the keyboard into real product ownership — identifying market
              gaps, building from the ground up, and steering ideas through the
              messy, rewarding process of shipping.
            </p>
          </div>
          <aside className="surface-card p-5 font-mono text-sm h-fit">
          <p className="text-(--accent)">$ whoami</p>
          <dl className="mt-3 space-y-3">
            <div>
              <dt className="text-(--text-muted)">name</dt>
              <dd className="mt-0.5">{aboutBio.name}</dd>
            </div>
            <div>
              <dt className="text-(--text-muted)">role</dt>
              <dd className="mt-0.5">{aboutBio.title}</dd>
            </div>
            <div>
              <dt className="text-(--text-muted)">location</dt>
              <dd className="mt-0.5">{aboutBio.location}</dd>
            </div>
            <div>
              <dt className="text-(--text-muted)">email</dt>
              <dd className="mt-0.5">
                <a
                  href={`mailto:${aboutBio.email}`}
                  className="text-(--accent) hover:underline"
                >
                  {aboutBio.email}
                </a>
              </dd>
            </div>
          </dl>
          </aside>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-mono text-(--text-muted)">
          $ ls projects --featured
        </h2>
        <p className="mt-2 text-sm text-(--text-muted)">
          {aboutBio.mission}
        </p>
        <div className="mt-6 grid md:grid-cols-2 gap-6 fade-up-stagger">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.name} project={project} featured />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-mono text-(--text-muted)">
          $ ls projects --all
        </h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {otherProjects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </section>

      <section className="mt-12 grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-mono text-(--text-muted)">
            $ cat skills.json
          </h2>
          <div className="mt-4 space-y-5">
            {skillGroups.map((group) => (
              <div key={group.label}>
                <h3 className="font-mono text-sm text-(--accent)">
                  {group.label}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="category-flag">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-mono text-(--text-muted)">
            $ cat background.log
          </h2>
          <ul className="mt-4 space-y-4">
            {highlights.map((item) => (
              <li
                key={item.label}
                className="surface-card p-4 font-mono text-sm"
              >
                <span className="text-(--accent)">[{item.label}]</span>
                <p className="mt-1 text-(--text-muted)">{item.value}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-mono text-(--text-muted)">
          $ ls hobbies --interests
        </h2>
        <p className="mt-2 text-sm text-(--text-muted)">
          When I&apos;m not shipping code, you&apos;ll usually find me doing one
          of these.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {hobbies.map((hobby) => (
            <span key={hobby} className="category-flag">
              {hobby}
            </span>
          ))}
        </div>
      </section>
    </section>
  );
}
