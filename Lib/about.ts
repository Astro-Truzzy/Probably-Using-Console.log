export interface Project {
  name: string;
  role: string;
  period?: string;
  description: string;
  stack: string[];
  href?: string;
  featured?: boolean;
}

export const aboutBio = {
  name: "Trust Williams",
  title: "Full-Stack Developer · Founder · Edo Tech Wave Ambassador",
  location: "Port Harcourt, Nigeria",
  email: "Taresy.dev@gmail.com",
  summary:
    "I'm a builder at heart. I write code, make sense of data, craft interfaces people enjoy using, and design visuals that stop the scroll — and all of it has shaped how I see the full picture of great digital products.",
  mission:
    "Share practical lessons in engineering and startups, and build products that solve real problems — especially for communities underserved by traditional tech infrastructure.",
};

export const featuredProjects: Project[] = [
  {
    name: "Ridely",
    role: "Founder & Full-Stack Developer",
    period: "2024 — Present",
    description:
      "Dispatch logistics platform connecting businesses with reliable riders for last-mile delivery. Built end-to-end with real-time rider tracking, distance-based pricing, and dual dashboards for customers and riders.",
    stack: ["React Native", "React", "Node.js"],
    href: "/blog/ridely-building-the-future-of-smart-deliveries-in-africa",
    featured: true,
  },
  {
    name: "Ownbase",
    role: "Founder & Full-Stack Developer",
    period: "2026",
    description:
      "Developer access and code management platform for non-technical business owners. Link GitHub or GitLab repos, grant granular developer access, and monitor repository activity — so when a developer leaves, the business keeps full control.",
    stack: ["TypeScript", "React", "Node.js", "Supabase"],
    featured: true,
  },
];

export const otherProjects: Project[] = [
  {
    name: "CryptoNow",
    role: "Full-Stack Developer",
    period: "2025",
    description:
      "Real-time crypto analytics dashboard aggregating CoinMarketCap and Finnhub data with Chart.js visualizations, watchlists, and dark/light mode.",
    stack: ["React", "Node.js", "Chart.js"],
  },
  {
    name: "VeluxLink",
    role: "Front-end Developer",
    period: "2025",
    description:
      "Web3 platform for celebrities to monetize fan interactions through voice and video call bookings, with Solana-based infrastructure.",
    stack: ["React", "Solana", "Web3"],
  },
  {
    name: "Nexus Gadgets",
    role: "Full-Stack Developer",
    period: "2026",
    description:
      "Feature-rich e-commerce platform with dynamic storefront, cart, checkout, user dashboards, and an admin panel for product and order management.",
    stack: ["Next.js", "Node.js", "MySQL"],
  },
  {
    name: "Homely",
    role: "Full-Stack Developer",
    period: "2024",
    description:
      "Property rental mobile app with map-based discovery, smart filtering, agent profiles, photo galleries, and verified reviews.",
    stack: ["React Native", "Appwrite"],
  },
  {
    name: "probably using console.log()",
    role: "Creator",
    period: "2026",
    description:
      "This blog — a terminal-inspired developer site with dynamic content, markdown posts, and a summon-anywhere CLI overlay.",
    stack: ["Next.js", "TypeScript", "Supabase"],
    href: "/",
  },
];

export const skillGroups = [
  {
    label: "Frontend",
    items: ["React", "Next.js", "React Native", "TypeScript", "Tailwind CSS"],
  },
  {
    label: "Backend",
    items: ["Node.js", "Express", "Supabase", "MySQL", "MongoDB", "Appwrite"],
  },
  {
    label: "Web3 & Data",
    items: ["Solana", "Solidity", "Chart.js", "Python"],
  },
  {
    label: "Design",
    items: ["Figma", "Adobe XD", "UI/UX", "Brand Identity"],
  },
];

export const highlights = [
  {
    label: "Edo Tech Wave",
    value: "Ambassador — mentoring, events, and community growth in Benin City",
  },
  {
    label: "Hackathon",
    value: "1st Runner-Up, Edo Tech Stars Hackathon 2024",
  },
  {
    label: "Education",
    value: "B.Sc. Microbiology, University of Benin (2020–2024)",
  },
  {
    label: "Languages",
    value: "English (fluent) · German & Japanese (conversational)",
  },
];

export const hobbies = [
  "Coding",
  "Reading sci-fi",
  "Watching movies",
  "Listening to music",
  "Exploring tech",
  "Designing",
];
