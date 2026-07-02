import type { Metadata } from "next";
import { authorEmail } from "@lib/config";
import { pageMetadata } from "@lib/seo";
import ContactForm from "./ContactForm";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with Trust Williams — full-stack developer, founder of Ridely and Ownbase.",
  path: "/contact",
});

export default function Contact() {
  return (
    <section>
      <h1 className="text-3xl font-mono">Contact</h1>
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-(--text-muted)">
            Email:{" "}
            <a
              href={`mailto:${authorEmail}`}
              className="text-(--accent) hover:underline"
            >
              {authorEmail}
            </a>
          </p>
          <p className="text-(--text-muted) mt-2">
            Socials: GitHub · Twitter · LinkedIn
          </p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
