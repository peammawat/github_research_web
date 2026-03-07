import { NextRequest, NextResponse } from "next/server";
import { searchRepositories } from "@/lib/github";
import { analyzeRepos } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { query, language, limit, minStars } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // 1. Search GitHub
    const repos = await searchRepositories(query, { language, limit, minStars });

    return NextResponse.json({ repos, analysis: "" });
  } catch (error: any) {
    console.error("Search Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
