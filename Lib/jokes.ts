export const JOKE_API_URL =
  "https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit";

export interface JokeResult {
  lines: string[];
}

interface JokeApiResponse {
  error: boolean;
  type: "single" | "twopart";
  joke?: string;
  setup?: string;
  delivery?: string;
}

const FALLBACK_JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "There are only 10 kinds of people: those who understand binary and those who don't.",
  "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
  "!false — it's funny because it's true.",
  "How do you comfort a JavaScript bug? You console it.",
  "99 little bugs in the code, 99 little bugs… take one down, patch it around, 127 little bugs in the code.",
];

function formatApiJoke(data: JokeApiResponse): JokeResult {
  if (data.type === "twopart" && data.setup && data.delivery) {
    return { lines: [data.setup, data.delivery] };
  }

  if (data.joke) {
    return { lines: [data.joke] };
  }

  throw new Error("invalid joke payload");
}

export function randomFallbackJoke(): JokeResult {
  const joke = FALLBACK_JOKES[Math.floor(Math.random() * FALLBACK_JOKES.length)];
  return { lines: [joke] };
}

export async function fetchProgrammingJoke(): Promise<JokeResult> {
  const res = await fetch(JOKE_API_URL, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("joke api request failed");
  }

  const data = (await res.json()) as JokeApiResponse;

  if (data.error) {
    throw new Error("joke api returned error");
  }

  return formatApiJoke(data);
}

export async function getProgrammingJoke(): Promise<JokeResult> {
  try {
    return await fetchProgrammingJoke();
  } catch {
    return randomFallbackJoke();
  }
}
