import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "../../../../../../Lib/auth";
import { previewMarkdownPost } from "../../../../../../Lib/posts";

const MAX_FILE_SIZE = 512 * 1024;
const MAX_FILES = 10;

function isMarkdownFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return name.endsWith(".md") || name.endsWith(".markdown");
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "invalid form data" }, { status: 400 });
  }

  const files = formData
    .getAll("files")
    .filter((entry): entry is File => entry instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "no files provided" }, { status: 400 });
  }

  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { error: `maximum ${MAX_FILES} files per upload` },
      { status: 400 }
    );
  }

  const results: Array<{
    filename: string;
    ok: boolean;
    preview?: Awaited<ReturnType<typeof previewMarkdownPost>>;
    error?: string;
  }> = [];

  for (const file of files) {
    if (!isMarkdownFile(file)) {
      results.push({
        filename: file.name,
        ok: false,
        error: "Only .md files are supported.",
      });
      continue;
    }

    if (file.size > MAX_FILE_SIZE) {
      results.push({
        filename: file.name,
        ok: false,
        error: "File exceeds 512 KB limit.",
      });
      continue;
    }

    try {
      const raw = await file.text();
      const preview = await previewMarkdownPost(raw, file.name);
      results.push({ filename: file.name, ok: true, preview });
    } catch (error) {
      results.push({
        filename: file.name,
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to parse markdown.",
      });
    }
  }

  const parsed = results.filter((result) => result.ok).length;
  const status = parsed > 0 ? 200 : 400;

  return NextResponse.json({ parsed, results }, { status });
}
