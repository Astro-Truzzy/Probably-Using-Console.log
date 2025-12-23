import React from "react";

export default function Contact() {
  return (
    <section>
      <h1 className="text-3xl font-mono">Contact</h1>
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-(--text-muted)">Email: trust@example.com</p>
          <p className="text-(--text-muted) mt-2">
            Socials: GitHub · Twitter · LinkedIn
          </p>
        </div>
        <form className="p-4 bg-white/5 rounded">
          <label className="block">
            Name
            <input className="w-full mt-2 p-2 rounded bg-transparent border border-white/10" />
          </label>
          <label className="block mt-3">
            Email
            <input className="w-full mt-2 p-2 rounded bg-transparent border border-white/10" />
          </label>
          <label className="block mt-3">
            Message
            <textarea
              className="w-full mt-2 p-2 rounded bg-transparent border border-white/10"
              rows={5}
            ></textarea>
          </label>
          <button className="mt-3 px-4 py-2 bg-(--accent) rounded">
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
