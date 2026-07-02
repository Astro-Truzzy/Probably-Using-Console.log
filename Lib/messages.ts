import fs from "fs";
import path from "path";
import { canUseLocalFileStorage } from "./config";

const DATA = path.join(process.cwd(), "Lib", "messages.json");

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
  date: string;
}

function readMessages(): ContactMessage[] {
  if (!fs.existsSync(DATA)) return [];
  return JSON.parse(fs.readFileSync(DATA, "utf-8")) as ContactMessage[];
}

export async function saveContactMessage(
  input: Pick<ContactMessage, "name" | "email" | "message">
): Promise<ContactMessage> {
  const entry: ContactMessage = {
    ...input,
    date: new Date().toISOString(),
  };

  if (!canUseLocalFileStorage()) {
    return entry;
  }

  const messages = readMessages();
  messages.unshift(entry);
  fs.writeFileSync(DATA, JSON.stringify(messages, null, 2));
  return entry;
}
