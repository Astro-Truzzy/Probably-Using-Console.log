import type { Metadata } from "next";
import Link from "next/link";
import { authorEmail, socialLinks } from "@lib/config";
import { contactIntro, contactNotes, contactTopics } from "@lib/contact";
import { pageMetadata } from "@lib/seo";
import ConsoleBreadcrumb from "../Components/terminal/ConsoleBreadcrumb";
import ContactForm from "./ContactForm";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with Trust Williams — full-stack developer, founder of Ridely and Ownbase, and Edo Tech Wave ambassador.",
  path: "/contact",
});

const socialItems = [
  { label: "GitHub", href: socialLinks.github },
  { label: "Twitter", href: socialLinks.twitter },
  { label: "LinkedIn", href: socialLinks.linkedIn },
].filter((item) => Boolean(item.href));

export default function Contact() {
  return (
    <section>
      <ConsoleBreadcrumb segments={["contact"]} />
      <h1 className="text-3xl font-mono">Contact</h1>

      <div className="mt-6 terminal terminal-panel max-w-3xl">
        <p className="text-lg leading-relaxed">{contactIntro.summary}</p>
        <p className="mt-4 terminal-muted leading-relaxed">
          {contactIntro.detail}
        </p>
      </div>

      <div className="mt-10 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] gap-8 items-start">
        <div className="space-y-8 min-w-0">
          <aside className="surface-card p-5 font-mono text-sm">
            <p className="text-(--accent)">$ cat contact.json</p>
            <dl className="mt-3 space-y-3">
              <div>
                <dt className="text-(--text-muted)">email</dt>
                <dd className="mt-0.5">
                  <a
                    href={`mailto:${authorEmail}`}
                    className="text-(--accent) hover:underline break-all"
                  >
                    {authorEmail}
                  </a>
                </dd>
              </div>
              {socialItems.length > 0 && (
                <div>
                  <dt className="text-(--text-muted)">socials</dt>
                  <dd className="mt-0.5 flex flex-wrap gap-x-3 gap-y-1">
                    {socialItems.map((item, index) => (
                      <span key={item.label}>
                        {index > 0 && (
                          <span className="text-(--text-muted) mr-3">·</span>
                        )}
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-(--accent) hover:underline"
                        >
                          {item.label}
                        </a>
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-(--text-muted)">location</dt>
                <dd className="mt-0.5">Port Harcourt, Nigeria (WAT)</dd>
              </div>
            </dl>
          </aside>

          <div>
            <h2 className="text-xl font-mono text-(--text-muted)">
              $ ls topics --open-for
            </h2>
            <ul className="mt-4 space-y-3">
              {contactTopics.map((topic) => (
                <li
                  key={topic.label}
                  className="surface-card p-4 font-mono text-sm"
                >
                  <span className="text-(--accent)">[{topic.label}]</span>
                  <p className="mt-1 text-(--text-muted)">{topic.value}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-mono text-(--text-muted)">
              $ cat notes.txt
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-(--text-muted) list-disc list-inside">
              {contactNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-(--text-muted)">
            New here? Read the{" "}
            <Link href="/about" className="text-(--accent) hover:underline">
              about page
            </Link>{" "}
            or browse the{" "}
            <Link href="/blog" className="text-(--accent) hover:underline">
              blog
            </Link>{" "}
            first — context helps.
          </p>
        </div>

        <div className="lg:sticky lg:top-24">
          <h2 className="text-sm font-mono text-(--text-muted) mb-3">
            $ send message
          </h2>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
