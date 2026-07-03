import { NextResponse } from "next/server";
import { getProgrammingJoke } from "@lib/jokes";

export async function GET() {
  const joke = await getProgrammingJoke();
  return NextResponse.json(joke);
}
